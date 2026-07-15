export const API_ROUTES = {
  catalog: {
    stickers: '/api/catalog/stickers',
    countries: '/api/catalog/countries',
    groups: '/api/catalog/groups',
  },
  collection: {
    root: '/api/collection',
    progress: '/api/collection/progress',
    sticker: (id: string) => `/api/collection/stickers/${id}`,
    increment: (id: string) => `/api/collection/stickers/${id}/increment`,
    decrement: (id: string) => `/api/collection/stickers/${id}/decrement`,
    register: '/api/collection/register',
  },
} as const;

export const ALBUM_ID = 'fifa-2026';
export const TOTAL_STICKERS = 994;

export const GROUP_DISPLAY_ORDER = [
  'FIFA World Cup',
  'Grupo A',
  'Grupo B',
  'Grupo C',
  'Grupo D',
  'Grupo E',
  'Grupo F',
  'Grupo G',
  'Grupo H',
  'Grupo I',
  'Grupo J',
  'Grupo K',
  'Grupo L',
  'Coca-Cola',
] as const;
