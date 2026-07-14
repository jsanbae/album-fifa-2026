import type { CollectionRepository } from '../domain/repositories/CollectionRepository.js';
import type { UserId } from '../domain/entities/UserId.js';
import type { CollectionEntryDTO } from './CollectionDTO.js';

export class GetCollectionUseCase {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  async execute(userId: UserId): Promise<CollectionEntryDTO[]> {
    const entries = await this.collectionRepository.findByUserId(userId);
    return entries.map((entry) => ({
      stickerId: entry.stickerId.value,
      count: entry.getCount(),
    }));
  }
}
