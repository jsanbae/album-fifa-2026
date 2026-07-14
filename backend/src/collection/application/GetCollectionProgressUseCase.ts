import { TOTAL_STICKERS } from '@album/common';
import type { CatalogRepository } from '../../catalog/domain/repositories/CatalogRepository.js';
import type { UserId } from '../domain/entities/UserId.js';
import type { CollectionRepository } from '../domain/repositories/CollectionRepository.js';
import type { CollectionProgressDTO } from './CollectionDTO.js';

export class GetCollectionProgressUseCase {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly catalogRepository: CatalogRepository,
  ) {}

  async execute(userId: UserId): Promise<CollectionProgressDTO> {
    const entries = await this.collectionRepository.findByUserId(userId);
    const owned = entries.filter((entry) => entry.getCount() >= 1).length;

    const catalogCount = await this.catalogRepository.countStickers();
    const total = catalogCount > 0 ? catalogCount : TOTAL_STICKERS;
    const percentage = total > 0 ? (owned / total) * 100 : 0;

    return {
      owned,
      total,
      percentage: Math.round(percentage * 10) / 10,
    };
  }
}
