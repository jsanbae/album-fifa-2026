import type { StickerDTO } from '../../adapters/CatalogApiAdapter.js';

export interface GroupProgress {
  owned: number;
  total: number;
  percentage: number;
}

export function computeGroupProgress(
  stickers: StickerDTO[],
  getCount: (stickerId: string) => number,
): GroupProgress {
  const total = stickers.length;
  const owned = stickers.filter((sticker) => getCount(sticker.id) > 0).length;
  const percentage =
    total > 0 ? Math.min(100, Math.max(0, Math.round((owned / total) * 100))) : 0;

  return { owned, total, percentage };
}

export function formatGroupProgressLabel(progress: GroupProgress): string {
  return `${progress.owned} / ${progress.total} (${progress.percentage}%)`;
}
