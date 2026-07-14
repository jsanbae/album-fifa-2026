import { CollectionEntry } from '../domain/entities/CollectionEntry.js';
import { StickerNumber } from '../../catalog/domain/entities/StickerNumber.js';
import type { UserId } from '../domain/entities/UserId.js';
import type { CollectionRepository } from '../domain/repositories/CollectionRepository.js';
import type { CollectionEntryDTO } from './CollectionDTO.js';

export class SetStickerCountUseCase {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  async execute(userId: UserId, stickerIdValue: string, count: number): Promise<CollectionEntryDTO> {
    const stickerId = StickerNumber.create(stickerIdValue);
    const entry = CollectionEntry.create(userId, stickerId, count);

    await this.collectionRepository.save(entry);

    return {
      stickerId: entry.stickerId.value,
      count: entry.getCount(),
    };
  }
}
