import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CollectionApiAdapter } from '../src/collection/infrastructure/adapters/CollectionApiAdapter.js';
import { useCollection } from '../src/collection/infrastructure/ui/store/useCollection.hook.js';

function createAdapter(
  overrides: Partial<CollectionApiAdapter> = {},
): CollectionApiAdapter {
  return {
    fetchCollection: vi.fn().mockResolvedValue([]),
    fetchProgress: vi.fn().mockResolvedValue({ owned: 0, total: 5, percentage: 0 }),
    increment: vi.fn(),
    decrement: vi.fn(),
    setCount: vi.fn(),
    registerByCode: vi.fn(),
    ...overrides,
  } as CollectionApiAdapter;
}

describe('useCollection', () => {
  it('merges counts from registerByCode response', async () => {
    const registerByCode = vi.fn().mockResolvedValue({
      updated: [
        { stickerId: 'MEX1', count: 1 },
        { stickerId: 'MEX2', count: 2 },
      ],
      unknownCodes: [],
    });
    const adapter = createAdapter({ registerByCode });
    const { result } = renderHook(() => useCollection(adapter));

    await act(async () => {
      await result.current.registerByCode('MEX1, MEX2');
    });

    await waitFor(() => {
      expect(result.current.counts).toEqual({ MEX1: 1, MEX2: 2 });
    });
    expect(registerByCode).toHaveBeenCalledWith('MEX1, MEX2');
  });

  it('updates progress when registerByCode adds a new owned sticker', async () => {
    const registerByCode = vi.fn().mockResolvedValue({
      updated: [{ stickerId: 'MEX1', count: 1 }],
      unknownCodes: [],
    });
    const adapter = createAdapter({
      registerByCode,
      fetchProgress: vi.fn().mockResolvedValue({ owned: 0, total: 5, percentage: 0 }),
    });
    const { result } = renderHook(() => useCollection(adapter));

    await act(async () => {
      await result.current.loadCollection();
    });

    await act(async () => {
      await result.current.registerByCode('MEX1');
    });

    await waitFor(() => {
      expect(result.current.progress.getOrThrow()).toEqual({
        owned: 1,
        total: 5,
        percentage: 20,
      });
    });
  });

  it('surfaces registerByCode errors', async () => {
    const registerByCode = vi.fn().mockRejectedValue(new Error('Registration failed'));
    const adapter = createAdapter({ registerByCode });
    const { result } = renderHook(() => useCollection(adapter));

    await act(async () => {
      await result.current.registerByCode('MEX1');
    });

    await waitFor(() => {
      expect(result.current.error.getOrThrow()).toBe('Registration failed');
    });
  });
});
