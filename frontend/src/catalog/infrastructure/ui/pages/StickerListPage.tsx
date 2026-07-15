import { GROUP_DISPLAY_ORDER } from '@album/common';
import { useEffect, useId, useState } from 'react';
import type { StickerDTO } from '../../adapters/CatalogApiAdapter.js';
import { FilterChips } from '../components/FilterChips.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { StickerListSection } from '../components/StickerListSection.js';
import { StickerSearch } from '../components/StickerSearch.js';
import { WorldCupEmblem } from '../../../../shared/infrastructure/ui/components/WorldCupEmblem/WorldCupEmblem.js';
import { RegisterByCodeModal } from '../../../../collection/infrastructure/ui/components/RegisterByCodeModal.js';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import { filterStickersByOwnership } from '../components/stickerFilters.js';
import type { useCatalog } from '../store/useCatalog.hook.js';
import type { useCollection } from '../../../../collection/infrastructure/ui/store/useCollection.hook.js';
import styles from './StickerListPage.module.css';

interface StickerListPageProps {
  catalogHook: ReturnType<typeof useCatalog>;
  collectionHook: ReturnType<typeof useCollection>;
  isAuthenticated: boolean;
}

function groupStickers(stickers: StickerDTO[]): Map<string, StickerDTO[]> {
  const grouped = new Map<string, StickerDTO[]>();
  for (const groupName of GROUP_DISPLAY_ORDER) {
    grouped.set(groupName, []);
  }
  for (const sticker of stickers) {
    const list = grouped.get(sticker.group);
    if (list) {
      list.push(sticker);
    }
  }
  return grouped;
}

function visibleGroupsWithStickers(grouped: Map<string, StickerDTO[]>): string[] {
  return GROUP_DISPLAY_ORDER.filter((groupName) => (grouped.get(groupName)?.length ?? 0) > 0);
}

export function StickerListPage(props: StickerListPageProps) {
  const [searchInput, setSearchInput] = useState(props.catalogHook.search);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => new Set());
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    props.catalogHook.loadCatalog();
  }, []);

  useEffect(() => {
    if (props.isAuthenticated) {
      props.collectionHook.loadCollection();
    } else {
      props.collectionHook.reset();
    }
  }, [props.isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== props.catalogHook.search) {
        props.catalogHook.setSearch(searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleIncrement = (stickerId: string) => {
    const newCount = props.collectionHook.getCount(stickerId) + 1;
    props.catalogHook.updateStickerCount(stickerId, newCount);
    props.collectionHook.increment(stickerId);
  };

  const handleDecrement = (stickerId: string) => {
    const newCount = Math.max(0, props.collectionHook.getCount(stickerId) - 1);
    props.catalogHook.updateStickerCount(stickerId, newCount);
    props.collectionHook.decrement(stickerId);
  };

  const handleRegisterByCode = async (codes: string) => {
    const result = await props.collectionHook.registerByCode(codes);
    if (result) {
      for (const entry of result.updated) {
        props.catalogHook.updateStickerCount(entry.stickerId, entry.count);
      }
    }
    return result;
  };

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const displayContent = () => {
    if (props.catalogHook.loading && props.catalogHook.stickers.isNone()) {
      return (
        <p className={styles.message} role="status" aria-live="polite">
          {ui.album.loadingStickers}
        </p>
      );
    }

    if (props.catalogHook.error.isSome()) {
      return (
        <p className={styles.error} role="alert">
          {props.catalogHook.error.getOrThrow()}
        </p>
      );
    }

    return props.catalogHook.stickers.fold(
      () => <p className={styles.message}>{ui.album.noStickersLoaded}</p>,
      (stickers) => {
        const filtered = filterStickersByOwnership(
          stickers,
          props.catalogHook.filter,
          props.collectionHook.getCount,
        );

        if (filtered.length === 0) {
          return <p className={styles.message}>{ui.album.noStickersMatch}</p>;
        }

        const grouped = groupStickers(filtered);
        const visibleGroups = visibleGroupsWithStickers(grouped);
        const allCollapsed =
          visibleGroups.length > 0 && visibleGroups.every((groupName) => collapsedGroups.has(groupName));

        const collapseAll = () => {
          setCollapsedGroups(new Set(visibleGroups));
        };

        const expandAll = () => {
          setCollapsedGroups(new Set());
        };

        return (
          <>
            <div className={styles.sectionToolbar}>
              <button
                type="button"
                className={styles.sectionToolbarButton}
                onClick={allCollapsed ? expandAll : collapseAll}
              >
                {allCollapsed ? ui.album.expandAll : ui.album.collapseAll}
              </button>
            </div>
            {GROUP_DISPLAY_ORDER.map((groupName) => (
              <StickerListSection
                key={groupName}
                groupName={groupName}
                stickers={grouped.get(groupName) ?? []}
                getCount={props.collectionHook.getCount}
                isAuthenticated={props.isAuthenticated}
                isExpanded={!collapsedGroups.has(groupName)}
                onToggle={() => toggleGroup(groupName)}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            ))}
          </>
        );
      },
    );
  };

  return (
    <main className={styles.page} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div className={styles.headerBrand}>
          <WorldCupEmblem variant="compact" />
          <div className={styles.headerText}>
            <h1 id={titleId} className={styles.title}>
              Album FIFA 2026
            </h1>
            {!props.isAuthenticated && (
              <p className={styles.authHint}>{ui.album.authHint}</p>
            )}
          </div>
        </div>
      </header>

      <ProgressBar
        progress={props.collectionHook.progress}
        headerAction={
          props.isAuthenticated
            ? {
                label: ui.album.addCodes,
                ariaLabel: ui.album.registerByCodeAria,
                onClick: () => setRegisterModalOpen(true),
              }
            : undefined
        }
      />

      {props.isAuthenticated && registerModalOpen && (
        <RegisterByCodeModal
          open
          onClose={() => setRegisterModalOpen(false)}
          onRegister={handleRegisterByCode}
          loading={props.collectionHook.loading}
        />
      )}

      {props.collectionHook.error.isSome() && (
        <p className={styles.error} role="alert">
          {props.collectionHook.error.getOrThrow()}
        </p>
      )}

      <StickerSearch
        value={searchInput}
        onChange={setSearchInput}
        loading={props.catalogHook.loading && props.catalogHook.stickers.isSome()}
      />

      <FilterChips
        activeFilter={props.catalogHook.filter}
        onFilterChange={(filter) => props.catalogHook.setFilter(filter)}
      />

      <div className={styles.sections}>{displayContent()}</div>
    </main>
  );
}
