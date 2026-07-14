import { describe, expect, it } from 'vitest';
import { DomainError } from '@album/common';
import { StickerNumber } from '../../../src/catalog/domain/entities/StickerNumber.js';
import { UserId } from '../../../src/collection/domain/entities/UserId.js';
import { CollectionEntry } from '../../../src/collection/domain/entities/CollectionEntry.js';

describe('CollectionEntry', () => {
  const userId = UserId.create('user-1');
  const stickerId = StickerNumber.create('MEX1');

  it('creates entry with non-negative count', () => {
    const entry = CollectionEntry.create(userId, stickerId, 2);
    expect(entry.getCount()).toBe(2);
  });

  it('rejects negative count', () => {
    expect(() => CollectionEntry.create(userId, stickerId, -1)).toThrow(DomainError);
  });

  it('increments count', () => {
    const entry = CollectionEntry.create(userId, stickerId, 1).increment();
    expect(entry.getCount()).toBe(2);
  });

  it('decrements count', () => {
    const entry = CollectionEntry.create(userId, stickerId, 2).decrement();
    expect(entry.getCount()).toBe(1);
  });

  it('floors decrement at zero', () => {
    const entry = CollectionEntry.create(userId, stickerId, 0).decrement();
    expect(entry.getCount()).toBe(0);
  });

  it('sets count directly', () => {
    const entry = CollectionEntry.create(userId, stickerId, 1).setCount(5);
    expect(entry.getCount()).toBe(5);
  });
});
