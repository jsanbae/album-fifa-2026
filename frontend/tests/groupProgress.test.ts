import { describe, expect, it } from 'vitest';
import type { StickerDTO } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';
import {
  computeGroupProgress,
  formatGroupProgressLabel,
} from '../src/catalog/infrastructure/ui/components/groupProgress.js';

const stickers: StickerDTO[] = [
  {
    id: 'FWC1',
    name: 'FWC 1',
    countryId: null,
    group: 'FIFA World Cup',
    countryName: null,
    isoCode: null,
  },
  {
    id: 'FWC2',
    name: 'FWC 2',
    countryId: null,
    group: 'FIFA World Cup',
    countryName: null,
    isoCode: null,
  },
  {
    id: 'FWC3',
    name: 'FWC 3',
    countryId: null,
    group: 'FIFA World Cup',
    countryName: null,
    isoCode: null,
  },
];

describe('The group progress helper', () => {
  it('calculates owned, total, and percentage for a sticker set', () => {
    const counts: Record<string, number> = { FWC1: 1, FWC2: 2, FWC3: 0 };

    const progress = computeGroupProgress(stickers, (id) => counts[id] ?? 0);

    expect(progress).toEqual({ owned: 2, total: 3, percentage: 67 });
    expect(formatGroupProgressLabel(progress)).toBe('2 / 3 (67%)');
  });
});
