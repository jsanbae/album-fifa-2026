import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { loadRootEnv } from '../src/shared/loadRootEnv.js';

loadRootEnv();

function resolveDatabaseUrl(): string {
  const directUrl = process.env.DATABASE_URL;
  if (directUrl) {
    return directUrl;
  }

  const password = process.env.DB_PASSWORD;
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!password || !supabaseUrl) {
    throw new Error(
      'Missing database credentials. Set DATABASE_URL or SUPABASE_URL + DB_PASSWORD.',
    );
  }

  const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;
}

async function main(): Promise<void> {
  const migrationsDir = resolve(
    fileURLToPath(new URL('../supabase/migrations', import.meta.url)),
  );
  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('No migration files found.');
    return;
  }

  const client = new pg.Client({ connectionString: resolveDatabaseUrl() });
  await client.connect();

  try {
    for (const file of migrationFiles) {
      const sql = await readFile(resolve(migrationsDir, file), 'utf8');
      console.log(`Running ${file}...`);
      await client.query(sql);
      console.log(`Applied ${file}`);
    }
  } finally {
    await client.end();
  }

  console.log(`Migrations complete (${migrationFiles.length} file(s)).`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Migration failed: ${message}`);
  process.exit(1);
});
