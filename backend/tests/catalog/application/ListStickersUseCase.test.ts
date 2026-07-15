import { describe, expect, it } from 'vitest';
import { ListStickersUseCase } from '../../../src/catalog/application/ListStickersUseCase.js';
import { createTestCatalogRepository } from '../../helpers/testCatalog.js';

describe('ListStickersUseCase', () => {
  const catalogRepository = createTestCatalogRepository();
  const useCase = new ListStickersUseCase(catalogRepository);

  it('lists all stickers with country enrichment', async () => {
    const stickers = await useCase.execute();
    expect(stickers).toHaveLength(5);
    const mexSticker = stickers.find((s) => s.id === 'MEX1');
    expect(mexSticker?.countryName).toBe('México');
    expect(mexSticker?.isoCode).toBe('MX');
  });

  it('filters by group', async () => {
    const stickers = await useCase.execute({ group: 'Grupo A' });
    expect(stickers.every((s) => s.group === 'Grupo A')).toBe(true);
    expect(stickers).toHaveLength(3);
  });

  it('filters by country id', async () => {
    const stickers = await useCase.execute({ country: 'MEX' });

    expect(stickers.map((s) => s.id)).toEqual(['MEX1', 'MEX2']);
    expect(stickers.every((s) => s.countryId === 'MEX')).toBe(true);
  });

  it('excludes stickers without country when filtering by country', async () => {
    const stickers = await useCase.execute({ country: 'MEX' });

    expect(stickers.some((s) => s.countryId === null)).toBe(false);
    expect(stickers.map((s) => s.id)).not.toContain('FWC1');
    expect(stickers.map((s) => s.id)).not.toContain('CC1');
  });

  it('combines country filter with search', async () => {
    const stickers = await useCase.execute({ country: 'MEX', search: 'MEX1' });

    expect(stickers.map((s) => s.id)).toEqual(['MEX1']);
  });

  it('searches by id prefix', async () => {
    const stickers = await useCase.execute({ search: 'MEX' });
    expect(stickers.map((s) => s.id)).toEqual(['MEX1', 'MEX2']);
  });

  it('searches by id prefix case-insensitively', async () => {
    const stickers = await useCase.execute({ search: 'mex' });
    expect(stickers.map((s) => s.id)).toEqual(['MEX1', 'MEX2']);
  });

  it('searches by name substring', async () => {
    const stickers = await useCase.execute({ search: 'Yamal' });
    expect(stickers.map((s) => s.id)).toEqual(['CC1']);
  });

  it('searches by name substring case-insensitively', async () => {
    const stickers = await useCase.execute({ search: 'yamal' });
    expect(stickers.map((s) => s.id)).toEqual(['CC1']);
  });

  it('treats whitespace-only search as no filter', async () => {
    const stickers = await useCase.execute({ search: '   ' });
    expect(stickers).toHaveLength(5);
  });

  it('includes counts when provided', async () => {
    const counts = new Map([['MEX1', 2], ['MEX2', 0]]);
    const stickers = await useCase.execute({}, counts);
    const mex1 = stickers.find((s) => s.id === 'MEX1');
    const mex2 = stickers.find((s) => s.id === 'MEX2');
    expect(mex1?.count).toBe(2);
    expect(mex2?.count).toBe(0);
  });
});
