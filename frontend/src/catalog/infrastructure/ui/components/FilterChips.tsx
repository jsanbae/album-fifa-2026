import { GROUP_DISPLAY_ORDER } from '@album/common';
import type { CatalogFilter } from '../store/useCatalog.hook.js';
import { GroupIcon } from './icons/GroupIcon.js';
import styles from './FilterChips.module.css';

interface FilterChipsProps {
  activeFilter: CatalogFilter;
  onFilterChange: (filter: CatalogFilter) => void;
}

const BASE_FILTERS: CatalogFilter[] = ['all', 'missing', 'collected', 'duplicates'];

function filterLabel(filter: CatalogFilter): string {
  if (filter === 'all') {
    return 'All';
  }
  if (filter === 'missing') {
    return 'Missing';
  }
  if (filter === 'collected') {
    return 'Collected';
  }
  if (filter === 'duplicates') {
    return 'Duplicates';
  }
  return filter;
}

export function FilterChips(props: FilterChipsProps) {
  const filters: CatalogFilter[] = [...BASE_FILTERS, ...GROUP_DISPLAY_ORDER];

  return (
    <div className={styles.container} role="group" aria-label="Filter stickers">
      {filters.map((filter) => {
        const label = filterLabel(filter);
        const isActive = props.activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            className={isActive ? styles.chipActive : styles.chip}
            onClick={() => props.onFilterChange(filter)}
            aria-pressed={isActive}
            aria-label={label}
          >
            <GroupIcon groupName={filter} size="sm" />
            <span className={styles.chipLabel}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
