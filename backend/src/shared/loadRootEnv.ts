import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface LoadRootEnvOptions {
  startDir?: string;
}

function findRootEnvPath(startDir: string): string | undefined {
  let currentDir = resolve(startDir);

  while (true) {
    const envPath = resolve(currentDir, '.env');
    if (existsSync(envPath)) {
      return envPath;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return undefined;
    }
    currentDir = parentDir;
  }
}

export function loadRootEnv(options: LoadRootEnvOptions = {}): void {
  const startDir =
    options.startDir ?? dirname(fileURLToPath(import.meta.url));
  const envPath = findRootEnvPath(startDir);

  if (envPath) {
    config({ path: envPath });
  }
}
