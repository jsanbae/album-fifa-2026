import { Maybe } from '@album/common';
import { useState } from 'react';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type {
  CatalogApiAdapter,
  CountryDTO,
  GroupDTO,
  StickerDTO,
} from '../../adapters/CatalogApiAdapter.js';

export type OwnershipFilter = 'all' | 'missing' | 'collected' | 'duplicates';

export type ScopeFilter =
  | { kind: 'none' }
  | { kind: 'group'; name: string }
  | { kind: 'country'; id: string };

interface CatalogState {
  stickers: Maybe<StickerDTO[]>;
  countries: Maybe<CountryDTO[]>;
  groups: Maybe<GroupDTO[]>;
  ownershipFilter: OwnershipFilter;
  scopeFilter: ScopeFilter;
  search: string;
  loading: boolean;
  error: Maybe<string>;
}

const initialState: CatalogState = {
  stickers: Maybe.none(),
  countries: Maybe.none(),
  groups: Maybe.none(),
  ownershipFilter: 'all',
  scopeFilter: { kind: 'none' },
  search: '',
  loading: false,
  error: Maybe.none(),
};

function buildFetchParams(scopeFilter: ScopeFilter, search: string) {
  return {
    group: scopeFilter.kind === 'group' ? scopeFilter.name : undefined,
    country: scopeFilter.kind === 'country' ? scopeFilter.id : undefined,
    search: search || undefined,
  };
}

function isSameScope(a: ScopeFilter, b: ScopeFilter): boolean {
  if (a.kind !== b.kind) {
    return false;
  }
  if (a.kind === 'group' && b.kind === 'group') {
    return a.name === b.name;
  }
  if (a.kind === 'country' && b.kind === 'country') {
    return a.id === b.id;
  }
  return a.kind === 'none' && b.kind === 'none';
}

export function useCatalog(adapter: CatalogApiAdapter) {
  const [state, setState] = useState<CatalogState>(initialState);

  const startLoading = () => {
    setState((prev) => ({ ...prev, loading: true, error: Maybe.none() }));
  };

  const setError = (message: string) => {
    setState((prev) => ({
      ...prev,
      loading: false,
      error: Maybe.some(message),
    }));
  };

  const loadCatalog = async () => {
    startLoading();
    try {
      const [countries, groups] = await Promise.all([
        adapter.fetchCountries(),
        adapter.fetchGroups(),
      ]);
      setState((prev) => ({
        ...prev,
        countries: Maybe.some(countries),
        groups: Maybe.some(groups),
      }));
      await loadStickersInternal('all', { kind: 'none' }, '', countries, groups);
    } catch (error) {
      setError(error instanceof Error ? error.message : ui.errors.loadCatalog);
    }
  };

  const loadStickersInternal = async (
    ownershipFilter: OwnershipFilter,
    scopeFilter: ScopeFilter,
    search: string,
    countries?: CountryDTO[],
    groups?: GroupDTO[],
  ) => {
    startLoading();
    try {
      const stickers = await adapter.fetchStickers(buildFetchParams(scopeFilter, search));
      setState((prev) => ({
        ...prev,
        stickers: Maybe.some(stickers),
        countries: countries ? Maybe.some(countries) : prev.countries,
        groups: groups ? Maybe.some(groups) : prev.groups,
        ownershipFilter,
        scopeFilter,
        search,
        loading: false,
        error: Maybe.none(),
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : ui.errors.loadStickers);
    }
  };

  const loadStickers = async () => {
    await loadStickersInternal(state.ownershipFilter, state.scopeFilter, state.search);
  };

  const setOwnershipFilter = async (ownershipFilter: OwnershipFilter) => {
    await loadStickersInternal(ownershipFilter, state.scopeFilter, state.search);
  };

  const setScopeFilter = async (scopeFilter: ScopeFilter) => {
    const nextScope = isSameScope(state.scopeFilter, scopeFilter)
      ? ({ kind: 'none' } as const)
      : scopeFilter;
    await loadStickersInternal(state.ownershipFilter, nextScope, state.search);
  };

  const setSearch = async (search: string) => {
    await loadStickersInternal(state.ownershipFilter, state.scopeFilter, search);
  };

  const clearScopeFilter = async () => {
    if (state.scopeFilter.kind === 'none') {
      return;
    }
    await loadStickersInternal(state.ownershipFilter, { kind: 'none' }, state.search);
  };

  const updateStickerCount = (stickerId: string, count: number) => {
    setState((prev) =>
      prev.stickers.fold(
        () => prev,
        (stickers) => ({
          ...prev,
          stickers: Maybe.some(
            stickers.map((sticker) =>
              sticker.id === stickerId ? { ...sticker, count } : sticker,
            ),
          ),
        }),
      ),
    );
  };

  return {
    stickers: state.stickers,
    countries: state.countries,
    groups: state.groups,
    ownershipFilter: state.ownershipFilter,
    scopeFilter: state.scopeFilter,
    search: state.search,
    loading: state.loading,
    error: state.error,
    loadCatalog,
    loadStickers,
    setOwnershipFilter,
    setScopeFilter,
    clearScopeFilter,
    setSearch,
    updateStickerCount,
  };
}
