import { useState } from 'react';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { CountryDTO } from '../../adapters/CatalogApiAdapter.js';
import type { OwnershipFilter, ScopeFilter } from '../store/useCatalog.hook.js';
import { FilterSheet } from './FilterSheet.js';
import { hasActiveScope, OWNERSHIP_FILTERS, ownershipLabel } from './filterChipUtils.js';
import styles from './FilterBar.module.css';
import chipStyles from './FilterChips.module.css';

interface FilterBarProps {
  ownershipFilter: OwnershipFilter;
  scopeFilter: ScopeFilter;
  countries: CountryDTO[];
  onOwnershipChange: (filter: OwnershipFilter) => void;
  onScopeChange: (scope: ScopeFilter) => void;
}

export function FilterBar(props: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const scopeActive = hasActiveScope(props.scopeFilter);

  return (
    <div className={styles.container} aria-label={ui.album.filterStickers}>
      <section className={styles.section} aria-labelledby="filter-section-estado">
        <h2 id="filter-section-estado" className={styles.sectionTitle}>
          {ui.album.filterSectionEstado}
        </h2>
        <div className={styles.row}>
          <div
            className={chipStyles.chips}
            role="group"
            aria-label={ui.album.filterSectionEstado}
          >
            {OWNERSHIP_FILTERS.map((filter) => {
              const label = ownershipLabel(filter);
              const isActive = props.ownershipFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  className={isActive ? chipStyles.chipActive : chipStyles.chip}
                  onClick={() => props.onOwnershipChange(filter)}
                  aria-pressed={isActive}
                  aria-label={label}
                >
                  <span className={chipStyles.chipLabel}>{label}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className={styles.filtersButton}
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
          >
            {ui.album.filterOpen}
            {scopeActive && (
              <span className={styles.badge} aria-label={ui.album.filterScopeActive}>
                1
              </span>
            )}
          </button>
        </div>
      </section>

      <FilterSheet
        open={sheetOpen}
        scopeFilter={props.scopeFilter}
        countries={props.countries}
        onClose={() => setSheetOpen(false)}
        onScopeChange={props.onScopeChange}
      />
    </div>
  );
}