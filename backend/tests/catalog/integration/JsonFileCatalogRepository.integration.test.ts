import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOTAL_STICKERS } from '@album/common';
import { JsonFileCatalogRepository } from '../../../src/catalog/infrastructure/adapters/JsonFileCatalogRepository.js';

describe('JsonFileCatalogRepository', () => {
  const dataDir = resolve(import.meta.dirname, '../../../../data');

  it('loads stickers and countries from JSON files', async () => {
    const repository = JsonFileCatalogRepository.create(dataDir);

    const stickers = await repository.findAllStickers();
    const countries = await repository.findAllCountries();
    const groups = await repository.findAllGroups();

    expect(stickers).toHaveLength(TOTAL_STICKERS);
    expect(countries).toHaveLength(48);
    expect(groups.length).toBeGreaterThan(0);
    expect(repository.getAlbum().id).toBe('fifa-2026');
  });

  it('enriches country data consistently', async () => {
    const repository = JsonFileCatalogRepository.create(dataDir);
    const countries = await repository.findAllCountries();
    const mexico = countries.find((c) => c.id === 'MEX');
    expect(mexico?.name).toBe('México');
    expect(mexico?.isoCode).toBe('MX');
    expect(mexico?.groupId).toBeTruthy();
  });
});
