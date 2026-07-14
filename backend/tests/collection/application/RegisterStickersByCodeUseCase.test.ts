import { describe, expect, it, beforeEach } from 'vitest';
import { DomainError } from '@album/common';
import { StickerNumber } from '../../../src/catalog/domain/entities/StickerNumber.js';
import { RegisterStickersByCodeUseCase } from '../../../src/collection/application/RegisterStickersByCodeUseCase.js';
import { CollectionEntry } from '../../../src/collection/domain/entities/CollectionEntry.js';
import { UserId } from '../../../src/collection/domain/entities/UserId.js';
import { InMemoryCollectionRepository } from '../../../src/collection/domain/repositories/InMemoryCollectionRepository.js';
import { createTestCatalogRepository } from '../../helpers/testCatalog.js';

describe('RegisterStickersByCodeUseCase', () => {
  const userId = UserId.create('user-1');
  let collectionRepository: InMemoryCollectionRepository;
  let useCase: RegisterStickersByCodeUseCase;

  beforeEach(() => {
    collectionRepository = new InMemoryCollectionRepository();
    useCase = new RegisterStickersByCodeUseCase(
      collectionRepository,
      createTestCatalogRepository(),
    );
  });

  it('registers new stickers from comma-separated codes', async () => {
    const result = await useCase.execute(userId, 'MEX1, MEX2');

    expect(result).toEqual({
      updated: [
        { stickerId: 'MEX1', count: 1 },
        { stickerId: 'MEX2', count: 1 },
      ],
      unknownCodes: [],
    });
  });

  it('increments already-owned stickers', async () => {
    await collectionRepository.save(CollectionEntry.create(userId, StickerNumber.create('MEX1'), 2));

    const result = await useCase.execute(userId, 'MEX1');

    expect(result).toEqual({
      updated: [{ stickerId: 'MEX1', count: 3 }],
      unknownCodes: [],
    });
  });

  it('increments duplicate codes in input twice', async () => {
    const result = await useCase.execute(userId, 'MEX1, MEX1');

    expect(result).toEqual({
      updated: [{ stickerId: 'MEX1', count: 2 }],
      unknownCodes: [],
    });
  });

  it('matches codes case-insensitively', async () => {
    const result = await useCase.execute(userId, 'mex1');

    expect(result).toEqual({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });
  });

  it('trims whitespace and ignores empty segments', async () => {
    const result = await useCase.execute(userId, ' MEX1 , , MEX2 ');

    expect(result).toEqual({
      updated: [
        { stickerId: 'MEX1', count: 1 },
        { stickerId: 'MEX2', count: 1 },
      ],
      unknownCodes: [],
    });
  });

  it('reports unknown codes without failing valid codes', async () => {
    const result = await useCase.execute(userId, 'MEX1, NOTREAL');

    expect(result).toEqual({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: ['NOTREAL'],
    });
  });

  it('rejects empty input', async () => {
    await expect(useCase.execute(userId, '')).rejects.toThrow(DomainError);
    await expect(useCase.execute(userId, '   ,  ')).rejects.toThrow(DomainError);
  });
});
