import { GROUP_DISPLAY_ORDER } from '@album/common';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { CountryDTO } from '../../adapters/CatalogApiAdapter.js';
import type { OwnershipFilter, ScopeFilter } from '../store/useCatalog.hook.js';
import { CountryFlag } from './CountryFlag.js';
import { GroupIcon } from './icons/GroupIcon.js';
import styles from './FilterChips.module.css';

interface FilterChipsProps {
  ownershipFilter: OwnershipFilter;
  scopeFilter: ScopeFilter;
  countries: CountryDTO[];
  onOwnershipChange: (filter: OwnershipFilter) => void;
  onScopeChange: (scope: ScopeFilter) => void;
}

const OWNERSHIP_FILTERS: OwnershipFilter[] = ['all', 'missing', 'collected', 'duplicates'];

function ownershipLabel(filter: OwnershipFilter): string {
  if (filter === 'all') {
    return ui.album.filterAll;
  }
  if (filter === 'missing') {
    return ui.album.filterMissing;
  }
  if (filter === 'collected') {
    return ui.album.filterCollected;
  }
  return ui.album.filterDuplicates;
}

function sortCountriesByName(countries: CountryDTO[]): CountryDTO[] {
  return [...countries].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function isGroupActive(scopeFilter: ScopeFilter, groupName: string): boolean {
  return scopeFilter.kind === 'group' && scopeFilter.name === groupName;
}

function isCountryActive(scopeFilter: ScopeFilter, countryId: string): boolean {
  return scopeFilter.kind === 'country' && scopeFilter.id === countryId;
}

export function FilterChips(props: FilterChipsProps) {
  const sortedCountries = sortCountriesByName(props.countries);

  return (
    <div className={styles.container} aria-label={ui.album.filterStickers}>
      <section className={styles.section} aria-labelledby="filter-section-estado">
        <h2 id="filter-section-estado" className={styles.sectionTitle}>
          {ui.album.filterSectionEstado}
        </h2>
        <div
          className={styles.chips}
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
                className={isActive ? styles.chipActive : styles.chip}
                onClick={() => props.onOwnershipChange(filter)}
                aria-pressed={isActive}
                aria-label={label}
              >
                <span className={styles.chipLabel}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="filter-section-grupos">
        <h2 id="filter-section-grupos" className={styles.sectionTitle}>
          {ui.album.filterSectionGrupos}
        </h2>
        <div
          className={styles.chips}
          role="group"
          aria-label={ui.album.filterSectionGrupos}
        >
          {GROUP_DISPLAY_ORDER.map((groupName) => {
            const isActive = isGroupActive(props.scopeFilter, groupName);
            return (
              <button
                key={groupName}
                type="button"
                className={isActive ? styles.chipActive : styles.chip}
                onClick={() => props.onScopeChange({ kind: 'group', name: groupName })}
                aria-pressed={isActive}
                aria-label={groupName}
              >
                <GroupIcon groupName={groupName} size="sm" />
                <span className={styles.chipLabel}>{groupName}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="filter-section-paises">
        <h2 id="filter-section-paises" className={styles.sectionTitle}>
          {ui.album.filterSectionPaises}
        </h2>
        <div
          className={styles.chips}
          role="group"
          aria-label={ui.album.filterSectionPaises}
        >
          {sortedCountries.map((country) => {
            const isActive = isCountryActive(props.scopeFilter, country.id);
            return (
              <button
                key={country.id}
                type="button"
                className={isActive ? styles.chipActive : styles.chip}
                onClick={() => props.onScopeChange({ kind: 'country', id: country.id })}
                aria-pressed={isActive}
                aria-label={country.name}
              >
                <CountryFlag isoCode={country.isoCode} countryName={country.name} />
                <span className={styles.chipLabel}>{country.name}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
