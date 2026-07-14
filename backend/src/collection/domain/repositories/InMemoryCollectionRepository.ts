import { Maybe } from '@album/common';
import type { StickerNumber } from '../../../catalog/domain/entities/StickerNumber.js';
import type { CollectionEntry } from '../entities/CollectionEntry.js';
import type { UserId } from '../entities/UserId.js';
import type { CollectionRepository } from './CollectionRepository.js';

export class InMemoryCollectionRepository implements CollectionRepository {
  private readonly entries = new Map<string, CollectionEntry>();

  private key(userId: UserId, stickerId: StickerNumber): string {
    return `${userId.value}:${stickerId.value}`;
  }

  async findByUserId(userId: UserId): Promise<CollectionEntry[]> {
    return [...this.entries.values()].filter((entry) => entry.userId.equals(userId));
  }

  async findByUserIdAndStickerId(
    userId: UserId,
    stickerId: StickerNumber,
  ): Promise<Maybe<CollectionEntry>> {
    const entry = this.entries.get(this.key(userId, stickerId));
    return entry ? Maybe.some(entry) : Maybe.none();
  }

  async save(entry: CollectionEntry): Promise<void> {
    this.entries.set(this.key(entry.userId, entry.stickerId), entry);
  }
}
