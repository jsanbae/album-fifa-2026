import { GROUP_DISPLAY_ORDER } from '@album/common';
import { useId, useState } from 'react';
import { Modal } from '../../../../shared/infrastructure/ui/components/Modal/Modal.js';
import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { CountryDTO } from '../../adapters/CatalogApiAdapter.js';
import type { ScopeFilter } from '../store/useCatalog.hook.js';
import { CountryFlag } from './CountryFlag.js';
import {
  filterCountriesBySearch,
  sortCountriesByName,
} from './filterChipUtils.js';
import styles from './FilterChips.module.css';
import sheetStyles from './FilterSheet.module.css';
import { GroupIcon } from './icons/GroupIcon.js';

export type FilterSheetMode = 'groups' | 'countries';

interface FilterSheetProps {
  open: boolean;
  mode: FilterSheetMode;
  scopeFilter: ScopeFilter;
  countries: CountryDTO[];
  onClose: () => void;
  onScopeChange: (scope: ScopeFilter) => void;
}

function isGroupActive(scopeFilter: ScopeFilter, groupName: string): boolean {
  return scopeFilter.kind === 'group' && scopeFilter.name === groupName;
}

function isCountryActive(scopeFilter: ScopeFilter, countryId: string): boolean {
  return scopeFilter.kind === 'country' && scopeFilter.id === countryId;
}

export function FilterSheet(props: FilterSheetProps) {
  const titleId = useId();
  const countrySearchId = useId();
  const [countrySearch, setCountrySearch] = useState('');

  if (!props.open) {
    return null;
  }

  const title =
    props.mode === 'groups' ? ui.album.filterSectionGrupos : ui.album.filterSectionPaises;

  const handleScopeSelect = (scope: ScopeFilter) => {
    props.onScopeChange(scope);
    props.onClose();
  };

  if (props.mode === 'groups') {
    return (
      <Modal open={props.open} variant="sheet" title={title} titleId={titleId} onClose={props.onClose}>
        <div className={sheetStyles.content}>
          <div className={styles.chips} role="group" aria-label={ui.album.filterSectionGrupos}>
            {GROUP_DISPLAY_ORDER.map((groupName) => {
              const isActive = isGroupActive(props.scopeFilter, groupName);
              return (
                <button
                  key={groupName}
                  type="button"
                  className={isActive ? styles.chipActive : styles.chip}
                  onClick={() => handleScopeSelect({ kind: 'group', name: groupName })}
                  aria-pressed={isActive}
                  aria-label={groupName}
                >
                  <GroupIcon groupName={groupName} size="sm" />
                  <span className={styles.chipLabel}>{groupName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    );
  }

  const sortedCountries = sortCountriesByName(props.countries);
  const visibleCountries = filterCountriesBySearch(sortedCountries, countrySearch);

  return (
    <Modal open={props.open} variant="sheet" title={title} titleId={titleId} onClose={props.onClose}>
      <div className={sheetStyles.content}>
        <label className={sheetStyles.searchLabel} htmlFor={countrySearchId}>
          {ui.album.filterSearchCountry}
        </label>
        <input
          id={countrySearchId}
          className={sheetStyles.searchInput}
          type="search"
          value={countrySearch}
          onChange={(event) => setCountrySearch(event.target.value)}
          placeholder={ui.album.filterSearchCountryPlaceholder}
        />
        <div className={styles.chips} role="group" aria-label={ui.album.filterSectionPaises}>
          {visibleCountries.map((country) => {
            const isActive = isCountryActive(props.scopeFilter, country.id);
            return (
              <button
                key={country.id}
                type="button"
                className={isActive ? styles.chipActive : styles.chip}
                onClick={() => handleScopeSelect({ kind: 'country', id: country.id })}
                aria-pressed={isActive}
                aria-label={country.name}
              >
                <CountryFlag isoCode={country.isoCode} countryName={country.name} />
                <span className={styles.chipLabel}>{country.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
