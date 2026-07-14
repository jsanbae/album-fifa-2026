import { Maybe } from '@album/common';
import { useState } from 'react';
import type {
  CatalogApiAdapter,
  CountryDTO,
  GroupDTO,
  StickerDTO,
} from '../../adapters/CatalogApiAdapter.js';

export type CatalogFilter = 'all' | 'missing' | 'collected' | 'duplicates' | string;

interface CatalogState {
  stickers: Maybe<StickerDTO[]>;
  countries: Maybe<CountryDTO[]>;
  groups: Maybe<GroupDTO[]>;
  filter: CatalogFilter;
  search: string;
  loading: boolean;
  error: Maybe<string>;
}

const initialState: CatalogState = {
  stickers: Maybe.none(),
  countries: Maybe.none(),
  groups: Maybe.none(),
  filter: 'all',
  search: '',
  loading: false,
  error: Maybe.none(),
};

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
      await loadStickersInternal('all', '', countries, groups);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load catalog');
    }
  };

  const loadStickersInternal = async (
    filter: CatalogFilter,
    search: string,
    countries?: CountryDTO[],
    groups?: GroupDTO[],
  ) => {
    startLoading();
    try {
      const groupParam =
        filter !== 'all' &&
        filter !== 'missing' &&
        filter !== 'collected' &&
        filter !== 'duplicates'
          ? filter
          : undefined;
      const stickers = await adapter.fetchStickers({
        group: groupParam,
        search: search || undefined,
      });
      setState((prev) => ({
        ...prev,
        stickers: Maybe.some(stickers),
        countries: countries ? Maybe.some(countries) : prev.countries,
        groups: groups ? Maybe.some(groups) : prev.groups,
        filter,
        search,
        loading: false,
        error: Maybe.none(),
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load stickers');
    }
  };

  const loadStickers = async () => {
    await loadStickersInternal(state.filter, state.search);
  };

  const setFilter = async (filter: CatalogFilter) => {
    await loadStickersInternal(filter, state.search);
  };

  const setSearch = async (search: string) => {
    await loadStickersInternal(state.filter, search);
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
    filter: state.filter,
    search: state.search,
    loading: state.loading,
    error: state.error,
    loadCatalog,
    loadStickers,
    setFilter,
    setSearch,
    updateStickerCount,
  };
}
