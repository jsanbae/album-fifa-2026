import { describe, expect, it, beforeEach } from 'vitest';
import { TOTAL_STICKERS } from '@album/common';
import { StickerNumber } from '../../../src/catalog/domain/entities/StickerNumber.js';
import { GetCollectionProgressUseCase } from '../../../src/collection/application/GetCollectionProgressUseCase.js';
import { GetCollectionUseCase } from '../../../src/collection/application/GetCollectionUseCase.js';
import { IncrementStickerCountUseCase } from '../../../src/collection/application/IncrementStickerCountUseCase.js';
import { DecrementStickerCountUseCase } from '../../../src/collection/application/DecrementStickerCountUseCase.js';
import { SetStickerCountUseCase } from '../../../src/collection/application/SetStickerCountUseCase.js';
import { CollectionEntry } from '../../../src/collection/domain/entities/CollectionEntry.js';
import { UserId } from '../../../src/collection/domain/entities/UserId.js';
import { InMemoryCollectionRepository } from '../../../src/collection/domain/repositories/InMemoryCollectionRepository.js';
import { InMemoryCatalogRepository } from '../../../src/catalog/domain/repositories/InMemoryCatalogRepository.js';
import { createTestCatalogRepository } from '../../helpers/testCatalog.js';

describe('Collection use cases', () => {
  const userId = UserId.create('user-1');
  let collectionRepository: InMemoryCollectionRepository;
  let catalogRepository: InMemoryCatalogRepository;

  beforeEach(() => {
    collectionRepository = new InMemoryCollectionRepository();
    catalogRepository = createTestCatalogRepository();
  });

  it('returns user collection entries', async () => {
    await collectionRepository.save(CollectionEntry.create(userId, StickerNumber.create('MEX1'), 2));
    const useCase = new GetCollectionUseCase(collectionRepository);
    const collection = await useCase.execute(userId);
    expect(collection).toEqual([{ stickerId: 'MEX1', count: 2 }]);
  });

  it('increments from zero to one', async () => {
    const useCase = new IncrementStickerCountUseCase(collectionRepository);
    const result = await useCase.execute(userId, 'MEX1');
    expect(result).toEqual({ stickerId: 'MEX1', count: 1 });
  });

  it('decrements to zero floor', async () => {
    await collectionRepository.save(CollectionEntry.create(userId, StickerNumber.create('MEX1'), 1));
    const useCase = new DecrementStickerCountUseCase(collectionRepository);
    const result = await useCase.execute(userId, 'MEX1');
    expect(result.count).toBe(0);
  });

  it('sets count directly', async () => {
    const useCase = new SetStickerCountUseCase(collectionRepository);
    const result = await useCase.execute(userId, 'MEX1', 5);
    expect(result).toEqual({ stickerId: 'MEX1', count: 5 });
  });

  it('calculates progress by owned stickers not sum of counts', async () => {
    await collectionRepository.save(CollectionEntry.create(userId, StickerNumber.create('MEX1'), 3));
    await collectionRepository.save(CollectionEntry.create(userId, StickerNumber.create('MEX2'), 1));
    const useCase = new GetCollectionProgressUseCase(collectionRepository, catalogRepository);
    const progress = await useCase.execute(userId);
    expect(progress.owned).toBe(2);
    expect(progress.total).toBe(5);
    expect(progress.percentage).toBe(40);
  });

  it('uses TOTAL_STICKERS when catalog is empty', async () => {
    const emptyCatalog = InMemoryCatalogRepository.empty();
    const useCase = new GetCollectionProgressUseCase(collectionRepository, emptyCatalog);
    const progress = await useCase.execute(userId);
    expect(progress.total).toBe(TOTAL_STICKERS);
  });
});
