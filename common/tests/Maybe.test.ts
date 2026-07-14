import { describe, expect, it } from 'vitest';
import { Maybe } from '../src/domain/Maybe.js';

describe('Maybe', () => {
  it('folds some value', () => {
    const value = Maybe.some(3).fold(
      () => 'none',
      (n) => `count:${n}`,
    );
    expect(value).toBe('count:3');
  });

  it('folds none value', () => {
    const value = Maybe.none<number>().fold(
      () => 'empty',
      () => 'value',
    );
    expect(value).toBe('empty');
  });
});
