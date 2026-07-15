import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogApiAdapter } from '../src/catalog/infrastructure/adapters/CatalogApiAdapter.js';
import { useCatalog } from '../src/catalog/infrastructure/ui/store/useCatalog.hook.js';

function createAdapter(overrides: Partial<CatalogApiAdapter> = {}): CatalogApiAdapter {
  return {
    fetchStickers: vi.fn().mockResolvedValue([]),
    fetchCountries: vi.fn().mockResolvedValue([
      { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
    ]),
    fetchGroups: vi.fn().mockResolvedValue([{ id: 'A', name: 'Grupo A' }]),
    ...overrides,
  } as CatalogApiAdapter;
}

describe('useCatalog', () => {
  it('loads stickers by country scope without sending group', async () => {
    const fetchStickers = vi.fn().mockResolvedValue([]);
    const adapter = createAdapter({ fetchStickers });
    const { result } = renderHook(() => useCatalog(adapter));

    await act(async () => {
      await result.current.loadCatalog();
    });

    await act(async () => {
      await result.current.setScopeFilter({ kind: 'country', id: 'MEX' });
    });

    await waitFor(() => {
      expect(fetchStickers).toHaveBeenLastCalledWith({
        country: 'MEX',
        search: undefined,
      });
    });
    expect(result.current.scopeFilter).toEqual({ kind: 'country', id: 'MEX' });
  });

  it('keeps ownership filter when applying a country scope', async () => {
    const fetchStickers = vi.fn().mockResolvedValue([]);
    const adapter = createAdapter({ fetchStickers });
    const { result } = renderHook(() => useCatalog(adapter));

    await act(async () => {
      await result.current.loadCatalog();
    });

    await act(async () => {
      await result.current.setOwnershipFilter('missing');
    });

    await act(async () => {
      await result.current.setScopeFilter({ kind: 'country', id: 'MEX' });
    });

    await waitFor(() => {
      expect(result.current.ownershipFilter).toBe('missing');
      expect(result.current.scopeFilter).toEqual({ kind: 'country', id: 'MEX' });
    });
    expect(fetchStickers).toHaveBeenLastCalledWith({
      country: 'MEX',
      search: undefined,
    });
  });

  it('loads stickers by group scope without sending country', async () => {
    const fetchStickers = vi.fn().mockResolvedValue([]);
    const adapter = createAdapter({ fetchStickers });
    const { result } = renderHook(() => useCatalog(adapter));

    await act(async () => {
      await result.current.loadCatalog();
    });

    await act(async () => {
      await result.current.setScopeFilter({ kind: 'group', name: 'Grupo A' });
    });

    await waitFor(() => {
      expect(fetchStickers).toHaveBeenLastCalledWith({
        group: 'Grupo A',
        search: undefined,
      });
    });
  });

  it('clears country scope when selecting the active country again', async () => {
    const fetchStickers = vi.fn().mockResolvedValue([]);
    const adapter = createAdapter({ fetchStickers });
    const { result } = renderHook(() => useCatalog(adapter));

    await act(async () => {
      await result.current.loadCatalog();
    });

    await act(async () => {
      await result.current.setScopeFilter({ kind: 'country', id: 'MEX' });
    });

    await act(async () => {
      await result.current.setScopeFilter({ kind: 'country', id: 'MEX' });
    });

    await waitFor(() => {
      expect(result.current.scopeFilter).toEqual({ kind: 'none' });
    });
    expect(fetchStickers).toHaveBeenLastCalledWith({
      search: undefined,
    });
  });
});
