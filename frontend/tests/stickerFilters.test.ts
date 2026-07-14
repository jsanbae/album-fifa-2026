import { describe, expect, it } from 'vitest';
import type { StickerDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';
import { filterStickersByOwnership } from '../src/catalog/infrastructure/ui/components/stickerFilters.js';

const stickers: StickerDTO[] = [
  {
    id: 'MEX1',
    name: 'MEX 1',
    countryId: 'MEX',
    group: 'Grupo A',
    countryName: 'México',
    isoCode: 'mx',
  },
  {
    id: 'MEX2',
    name: 'MEX 2',
    countryId: 'MEX',
    group: 'Grupo A',
    countryName: 'México',
    isoCode: 'mx',
  },
  {
    id: 'FWC1',
    name: 'FWC 1',
    countryId: null,
    group: 'FIFA World Cup',
    countryName: null,
    isoCode: null,
  },
];

describe('filterStickersByOwnership', () => {
  it('returns only missing stickers when the missing filter is active', () => {
    const counts: Record<string, number> = { MEX1: 1, MEX2: 0, FWC1: 0 };

    const result = filterStickersByOwnership(stickers, 'missing', (id) => counts[id] ?? 0);

    expect(result.map((sticker) => sticker.id)).toEqual(['MEX2', 'FWC1']);
  });

  it('returns only collected stickers when the collected filter is active', () => {
    const counts: Record<string, number> = { MEX1: 1, MEX2: 0, FWC1: 2 };

    const result = filterStickersByOwnership(stickers, 'collected', (id) => counts[id] ?? 0);

    expect(result.map((sticker) => sticker.id)).toEqual(['MEX1', 'FWC1']);
  });

  it('returns only duplicate stickers when the duplicates filter is active', () => {
    const counts: Record<string, number> = { MEX1: 1, MEX2: 0, FWC1: 2 };

    const result = filterStickersByOwnership(stickers, 'duplicates', (id) => counts[id] ?? 0);

    expect(result.map((sticker) => sticker.id)).toEqual(['FWC1']);
  });

  it('returns all stickers for non-ownership filters', () => {
    const counts: Record<string, number> = { MEX1: 1, MEX2: 0, FWC1: 0 };

    const result = filterStickersByOwnership(stickers, 'all', (id) => counts[id] ?? 0);

    expect(result).toEqual(stickers);
  });
});
