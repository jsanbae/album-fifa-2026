import type { Maybe } from '@album/common';
import type { StickerNumber } from '../../../catalog/domain/entities/StickerNumber.js';
import type { CollectionEntry } from '../entities/CollectionEntry.js';
import type { UserId } from '../entities/UserId.js';

export interface CollectionRepository {
  findByUserId(userId: UserId): Promise<CollectionEntry[]>;
  findByUserIdAndStickerId(
    userId: UserId,
    stickerId: StickerNumber,
  ): Promise<Maybe<CollectionEntry>>;
  save(entry: CollectionEntry): Promise<void>;
}
