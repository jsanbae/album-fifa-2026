import { describe, expect, it } from 'vitest';
import { DomainError } from '@album/common';
import { StickerNumber } from '../../../src/catalog/domain/entities/StickerNumber.js';

describe('StickerNumber', () => {
  it('creates a valid sticker number', () => {
    const stickerNumber = StickerNumber.create('MEX3');
    expect(stickerNumber.value).toBe('MEX3');
  });

  it('rejects empty id', () => {
    expect(() => StickerNumber.create('')).toThrow(DomainError);
  });

  it('rejects whitespace-only id', () => {
    expect(() => StickerNumber.create('   ')).toThrow(DomainError);
  });

  it('matches id prefix', () => {
    const stickerNumber = StickerNumber.create('MEX10');
    expect(stickerNumber.startsWith('MEX')).toBe(true);
    expect(stickerNumber.startsWith('USA')).toBe(false);
  });
});
