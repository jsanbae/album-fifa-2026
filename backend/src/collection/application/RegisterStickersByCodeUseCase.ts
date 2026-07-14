import { DomainError } from '@album/common';
import type { CatalogRepository } from '../../catalog/domain/repositories/CatalogRepository.js';
import { StickerNumber } from '../../catalog/domain/entities/StickerNumber.js';
import { CollectionEntry } from '../domain/entities/CollectionEntry.js';
import type { UserId } from '../domain/entities/UserId.js';
import type { CollectionRepository } from '../domain/repositories/CollectionRepository.js';
import type { RegisterStickersByCodeResultDTO } from './CollectionDTO.js';

function parseCodes(codes: string): string[] {
  return codes
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

export class RegisterStickersByCodeUseCase {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly catalogRepository: CatalogRepository,
  ) {}

  async execute(userId: UserId, codes: string): Promise<RegisterStickersByCodeResultDTO> {
    const parsedCodes = parseCodes(codes);
    if (parsedCodes.length === 0) {
      throw DomainError.createValidation('At least one sticker code is required');
    }

    const stickers = await this.catalogRepository.findAllStickers();
    const catalogByLowerCase = new Map(
      stickers.map((sticker) => [sticker.id.value.toLowerCase(), sticker.id.value]),
    );

    const unknownCodes: string[] = [];
    const updatedOrder: string[] = [];
    const updatedCounts = new Map<string, number>();

    for (const code of parsedCodes) {
      const canonicalId = catalogByLowerCase.get(code.toLowerCase());
      if (!canonicalId) {
        unknownCodes.push(code);
        continue;
      }

      const stickerId = StickerNumber.create(canonicalId);
      const existing = await this.collectionRepository.findByUserIdAndStickerId(userId, stickerId);
      const entry = existing.fold(
        () => CollectionEntry.create(userId, stickerId, 1),
        (current) => current.increment(),
      );

      await this.collectionRepository.save(entry);

      if (!updatedCounts.has(canonicalId)) {
        updatedOrder.push(canonicalId);
      }
      updatedCounts.set(canonicalId, entry.getCount());
    }

    return {
      updated: updatedOrder.map((stickerId) => ({
        stickerId,
        count: updatedCounts.get(stickerId)!,
      })),
      unknownCodes,
    };
  }
}
