import type { Sticker } from '../domain/entities/Sticker.js';

export function matchesStickerSearch(sticker: Sticker, search: string): boolean {
  const normalized = search.trim().toLowerCase();
  if (normalized === '') {
    return true;
  }

  return (
    sticker.id.value.toLowerCase().startsWith(normalized) ||
    sticker.name.toLowerCase().includes(normalized)
  );
}
