import { useState } from 'react';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { CountryDTO } from '../../adapters/CatalogApiAdapter.js';
import type { OwnershipFilter, ScopeFilter } from '../store/useCatalog.hook.js';
import { FilterSheet, type FilterSheetMode } from './FilterSheet.js';
import { OWNERSHIP_FILTERS, ownershipLabel } from './filterChipUtils.js';
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
  const [sheetMode, setSheetMode] = useState<FilterSheetMode | null>(null);
  const groupActive = props.scopeFilter.kind === 'group';
  const countryActive = props.scopeFilter.kind === 'country';

  return (
    <div className={styles.container} aria-label={ui.album.filterStickers}>
      <section className={styles.section} aria-labelledby="filter-section-title">
        <h2 id="filter-section-title" className={styles.sectionTitle}>
          {ui.album.filterSectionTitle}
        </h2>
        <div
          className={chipStyles.chips}
          role="group"
          aria-label={ui.album.filterSectionTitle}
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
          <button
            type="button"
            className={groupActive ? chipStyles.chipActive : chipStyles.chip}
            onClick={() => setSheetMode('groups')}
            aria-pressed={groupActive}
            aria-haspopup="dialog"
            aria-label={ui.album.filterSectionGrupos}
          >
            <span className={chipStyles.chipLabel}>{ui.album.filterSectionGrupos}</span>
          </button>
          <button
            type="button"
            className={countryActive ? chipStyles.chipActive : chipStyles.chip}
            onClick={() => setSheetMode('countries')}
            aria-pressed={countryActive}
            aria-haspopup="dialog"
            aria-label={ui.album.filterSectionPaises}
          >
            <span className={chipStyles.chipLabel}>{ui.album.filterSectionPaises}</span>
          </button>
        </div>
      </section>

      {sheetMode !== null && (
        <FilterSheet
          open
          mode={sheetMode}
          scopeFilter={props.scopeFilter}
          countries={props.countries}
          onClose={() => setSheetMode(null)}
          onScopeChange={props.onScopeChange}
        />
      )}
    </div>
  );
}
