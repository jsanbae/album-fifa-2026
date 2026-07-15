import { Maybe } from '@album/common';
import { useState } from 'react';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type {
  CollectionApiAdapter,
  CollectionEntryDTO,
  CollectionProgressDTO,
  RegisterStickersByCodeResultDTO,
} from '../../adapters/CollectionApiAdapter.js';

interface CollectionState {
  counts: Record<string, number>;
  progress: Maybe<CollectionProgressDTO>;
  loading: boolean;
  error: Maybe<string>;
}

const initialState: CollectionState = {
  counts: {},
  progress: Maybe.none(),
  loading: false,
  error: Maybe.none(),
};

function entriesToCounts(entries: CollectionEntryDTO[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    counts[entry.stickerId] = entry.count;
  }
  return counts;
}

export function useCollection(adapter: CollectionApiAdapter) {
  const [state, setState] = useState<CollectionState>(initialState);

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

  const loadCollection = async () => {
    startLoading();
    try {
      const [entries, progress] = await Promise.all([
        adapter.fetchCollection(),
        adapter.fetchProgress(),
      ]);
      setState({
        counts: entriesToCounts(entries),
        progress: Maybe.some(progress),
        loading: false,
        error: Maybe.none(),
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : ui.errors.loadCollection);
    }
  };

  const getCount = (stickerId: string): number => {
    return state.counts[stickerId] ?? 0;
  };

  const applyOptimisticCount = (stickerId: string, nextCount: number) => {
    setState((prev) => {
      const previousCount = prev.counts[stickerId] ?? 0;
      const ownedDelta =
        previousCount === 0 && nextCount > 0
          ? 1
          : previousCount > 0 && nextCount === 0
            ? -1
            : 0;

      const progress = prev.progress.map((p) =>
        ownedDelta === 0
          ? p
          : {
              ...p,
              owned: Math.max(0, Math.min(p.total, p.owned + ownedDelta)),
              percentage: Math.round(
                (Math.max(0, Math.min(p.total, p.owned + ownedDelta)) / p.total) * 100,
              ),
            },
      );

      return {
        ...prev,
        counts: { ...prev.counts, [stickerId]: nextCount },
        progress,
      };
    });
  };

  const increment = async (stickerId: string) => {
    const previousCount = state.counts[stickerId] ?? 0;
    applyOptimisticCount(stickerId, previousCount + 1);
    try {
      const entry = await adapter.increment(stickerId);
      setState((prev) => ({
        ...prev,
        counts: { ...prev.counts, [stickerId]: entry.count },
      }));
    } catch (error) {
      applyOptimisticCount(stickerId, previousCount);
      setError(error instanceof Error ? error.message : ui.errors.incrementSticker);
    }
  };

  const decrement = async (stickerId: string) => {
    const previousCount = state.counts[stickerId] ?? 0;
    const nextCount = Math.max(0, previousCount - 1);
    applyOptimisticCount(stickerId, nextCount);
    try {
      const entry = await adapter.decrement(stickerId);
      setState((prev) => ({
        ...prev,
        counts: { ...prev.counts, [stickerId]: entry.count },
      }));
    } catch (error) {
      applyOptimisticCount(stickerId, previousCount);
      setError(error instanceof Error ? error.message : ui.errors.decrementSticker);
    }
  };

  const applyUpdatedCounts = (entries: CollectionEntryDTO[]) => {
    setState((prev) => {
      let counts = { ...prev.counts };
      let progress = prev.progress;

      for (const entry of entries) {
        const previousCount = counts[entry.stickerId] ?? 0;
        const ownedDelta =
          previousCount === 0 && entry.count > 0
            ? 1
            : previousCount > 0 && entry.count === 0
              ? -1
              : 0;

        counts = { ...counts, [entry.stickerId]: entry.count };
        progress = progress.map((p) =>
          ownedDelta === 0
            ? p
            : {
                ...p,
                owned: Math.max(0, Math.min(p.total, p.owned + ownedDelta)),
                percentage: Math.round(
                  (Math.max(0, Math.min(p.total, p.owned + ownedDelta)) / p.total) * 100,
                ),
              },
        );
      }

      return { ...prev, counts, progress };
    });
  };

  const registerByCode = async (codes: string): Promise<RegisterStickersByCodeResultDTO | null> => {
    startLoading();
    try {
      const result = await adapter.registerByCode(codes);
      applyUpdatedCounts(result.updated);
      setState((prev) => ({ ...prev, loading: false, error: Maybe.none() }));
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : ui.errors.registerStickers);
      return null;
    }
  };

  const reset = () => {
    setState(initialState);
  };

  return {
    counts: state.counts,
    progress: state.progress,
    loading: state.loading,
    error: state.error,
    loadCollection,
    getCount,
    increment,
    decrement,
    registerByCode,
    reset,
  };
}
