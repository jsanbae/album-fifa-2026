import { describe, expect, it } from 'vitest';
import { ALBUM_ID } from '@album/common';
import { Sticker } from '../../../src/catalog/domain/entities/Sticker.js';
import { StickerNumber } from '../../../src/catalog/domain/entities/StickerNumber.js';
import { matchesStickerSearch } from '../../../src/catalog/application/matchesStickerSearch.js';

describe('matchesStickerSearch', () => {
  const yamalSticker = Sticker.create(
    StickerNumber.create('CC1'),
    'Lamine Yamal',
    null,
    'Coca-Cola',
    ALBUM_ID,
  );

  it('matches id prefix case-insensitively', () => {
    expect(matchesStickerSearch(yamalSticker, 'cc')).toBe(true);
  });

  it('matches name substring case-insensitively', () => {
    expect(matchesStickerSearch(yamalSticker, 'yamal')).toBe(true);
    expect(matchesStickerSearch(yamalSticker, 'YAMAL')).toBe(true);
  });

  it('returns true for empty search', () => {
    expect(matchesStickerSearch(yamalSticker, '')).toBe(true);
    expect(matchesStickerSearch(yamalSticker, '   ')).toBe(true);
  });

  it('returns false when no match', () => {
    expect(matchesStickerSearch(yamalSticker, 'Messi')).toBe(false);
  });
});
