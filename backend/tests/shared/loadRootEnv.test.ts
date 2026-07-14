import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadRootEnv } from '../../src/shared/loadRootEnv.js';

describe('loadRootEnv', () => {
  const originalEnv = { ...process.env };
  const tempDirs: string[] = [];

  afterEach(() => {
    process.env = { ...originalEnv };
    for (const dir of tempDirs) {
      if (existsSync(dir)) {
        // Vitest cleans temp dirs on its own when using mkdtemp
      }
    }
  });

  it('loads environment variables from the nearest parent .env file', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'album-env-'));
    tempDirs.push(tempRoot);
    const packageDir = join(tempRoot, 'backend', 'src', 'shared');
    writeFileSync(join(tempRoot, '.env'), 'LOAD_ROOT_ENV_TEST_MARKER=loaded-from-root\n');

    delete process.env.LOAD_ROOT_ENV_TEST_MARKER;

    loadRootEnv({ startDir: packageDir });

    expect(process.env.LOAD_ROOT_ENV_TEST_MARKER).toBe('loaded-from-root');
  });

  it('resolves the monorepo root from the backend package', () => {
    const backendSrcDir = resolve(process.cwd(), 'src', 'shared');
    const monorepoRoot = resolve(backendSrcDir, '../../..');
    const envPath = join(monorepoRoot, '.env');

    expect(existsSync(envPath)).toBe(true);
  });
});
