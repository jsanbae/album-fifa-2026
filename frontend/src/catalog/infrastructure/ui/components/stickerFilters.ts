import type { StickerDTO } from '../../adapters/CatalogApiAdapter.js';
import type { CatalogFilter } from '../store/useCatalog.hook.js';

export function filterStickersByOwnership(
  stickers: StickerDTO[],
  filter: CatalogFilter,
  getCount: (stickerId: string) => number,
): StickerDTO[] {
  if (filter === 'missing') {
    return stickers.filter((sticker) => getCount(sticker.id) === 0);
  }

  if (filter === 'collected') {
    return stickers.filter((sticker) => getCount(sticker.id) >= 1);
  }

  if (filter === 'duplicates') {
    return stickers.filter((sticker) => getCount(sticker.id) >= 2);
  }

  return stickers;
}
