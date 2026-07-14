import { describe, expect, it, vi } from 'vitest';
import { API_ROUTES } from '@album/common';
import { CollectionApiAdapter } from '../src/collection/infrastructure/adapters/CollectionApiAdapter.js';
import type { HttpClient } from '../src/shared/infrastructure/HttpClient.js';

describe('CollectionApiAdapter', () => {
  it('registers stickers by comma-separated codes', async () => {
    const post = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });
    const httpClient = { post } as unknown as HttpClient;
    const adapter = new CollectionApiAdapter(httpClient);

    const result = await adapter.registerByCode('MEX1, MEX2');

    expect(post).toHaveBeenCalledWith(API_ROUTES.collection.register, { codes: 'MEX1, MEX2' });
    expect(result).toEqual({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });
  });
});
