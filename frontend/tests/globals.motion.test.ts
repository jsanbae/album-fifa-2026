import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const globalsCss = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../src/globals.css'),
  'utf8',
);

describe('The frontend motion policy', () => {
  it('defines product easing tokens for interactive feedback', () => {
    expect(globalsCss).toContain('--ease-out-quart:');
    expect(globalsCss).toContain('var(--ease-out-quart)');
  });

  it('honors prefers-reduced-motion across the interface', () => {
    expect(globalsCss).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(globalsCss).toContain('--transition-interactive: none');
    expect(globalsCss).toContain('transition-duration: 0.01ms !important');
    expect(globalsCss).toContain('animation-duration: 0.01ms !important');
    expect(globalsCss).toContain('scroll-behavior: auto !important');
    expect(globalsCss).toContain('button:active');
    expect(globalsCss).toContain('transform: none !important');
  });
});
