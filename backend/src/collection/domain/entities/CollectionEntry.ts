import { DomainError } from '@album/common';
import type { StickerNumber } from '../../../catalog/domain/entities/StickerNumber.js';
import type { UserId } from './UserId.js';

export class CollectionEntry {
  private constructor(
    readonly userId: UserId,
    readonly stickerId: StickerNumber,
    private readonly count: number,
  ) {}

  static create(userId: UserId, stickerId: StickerNumber, count: number): CollectionEntry {
    if (count < 0) {
      throw DomainError.createValidation('Count cannot be negative');
    }
    return new CollectionEntry(userId, stickerId, count);
  }

  getCount(): number {
    return this.count;
  }

  increment(): CollectionEntry {
    return CollectionEntry.create(this.userId, this.stickerId, this.count + 1);
  }

  decrement(): CollectionEntry {
    return CollectionEntry.create(this.userId, this.stickerId, Math.max(0, this.count - 1));
  }

  setCount(count: number): CollectionEntry {
    return CollectionEntry.create(this.userId, this.stickerId, count);
  }
}
