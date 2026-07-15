import { API_ROUTES } from '@album/common';
import { describe, expect, it, vi } from 'vitest';
import { CatalogApiAdapter } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';
import type { HttpClient } from '../src/shared/infrastructure/HttpClient.js';

describe('CatalogApiAdapter', () => {
  it('fetches stickers filtered by country', async () => {
    const get = vi.fn().mockResolvedValue([]);
    const httpClient = { get } as unknown as HttpClient;
    const adapter = new CatalogApiAdapter(httpClient);

    await adapter.fetchStickers({ country: 'MEX' });

    expect(get).toHaveBeenCalledWith(API_ROUTES.catalog.stickers, {
      group: undefined,
      country: 'MEX',
      search: undefined,
    });
  });

  it('fetches stickers filtered by group without country', async () => {
    const get = vi.fn().mockResolvedValue([]);
    const httpClient = { get } as unknown as HttpClient;
    const adapter = new CatalogApiAdapter(httpClient);

    await adapter.fetchStickers({ group: 'Grupo A' });

    expect(get).toHaveBeenCalledWith(API_ROUTES.catalog.stickers, {
      group: 'Grupo A',
      country: undefined,
      search: undefined,
    });
  });
});
