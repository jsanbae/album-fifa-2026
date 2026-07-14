import { StickerNumber } from '../../catalog/domain/entities/StickerNumber.js';
import { CollectionEntry } from '../domain/entities/CollectionEntry.js';
import type { UserId } from '../domain/entities/UserId.js';
import type { CollectionRepository } from '../domain/repositories/CollectionRepository.js';
import type { CollectionEntryDTO } from './CollectionDTO.js';

export class IncrementStickerCountUseCase {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  async execute(userId: UserId, stickerIdValue: string): Promise<CollectionEntryDTO> {
    const stickerId = StickerNumber.create(stickerIdValue);
    const existing = await this.collectionRepository.findByUserIdAndStickerId(userId, stickerId);

    const entry = existing.fold(
      () => CollectionEntry.create(userId, stickerId, 1),
      (current) => current.increment(),
    );

    await this.collectionRepository.save(entry);

    return {
      stickerId: entry.stickerId.value,
      count: entry.getCount(),
    };
  }
}
