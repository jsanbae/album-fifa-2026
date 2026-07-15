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

type FilterTab = 'groups' | 'countries';

interface FilterSheetProps {
  open: boolean;
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
  const [activeTab, setActiveTab] = useState<FilterTab>('groups');
  const [countrySearch, setCountrySearch] = useState('');

  if (!props.open) {
    return null;
  }

  const sortedCountries = sortCountriesByName(props.countries);
  const visibleCountries = filterCountriesBySearch(sortedCountries, countrySearch);

  const handleScopeSelect = (scope: ScopeFilter) => {
    props.onScopeChange(scope);
    props.onClose();
  };

  return (
    <Modal
      open={props.open}
      variant="sheet"
      title={ui.album.filterSheetTitle}
      titleId={titleId}
      onClose={props.onClose}
    >
      <div className={sheetStyles.content}>
        <div className={sheetStyles.tabs} role="tablist" aria-label={ui.album.filterSheetTitle}>
          <button
            type="button"
            role="tab"
            id="filter-tab-groups"
            aria-selected={activeTab === 'groups'}
            aria-controls="filter-panel-groups"
            className={activeTab === 'groups' ? sheetStyles.tabActive : sheetStyles.tab}
            onClick={() => setActiveTab('groups')}
          >
            {ui.album.filterTabGroups}
          </button>
          <button
            type="button"
            role="tab"
            id="filter-tab-countries"
            aria-selected={activeTab === 'countries'}
            aria-controls="filter-panel-countries"
            className={activeTab === 'countries' ? sheetStyles.tabActive : sheetStyles.tab}
            onClick={() => setActiveTab('countries')}
          >
            {ui.album.filterTabCountries}
          </button>
        </div>

        {activeTab === 'groups' && (
          <div
            id="filter-panel-groups"
            role="tabpanel"
            aria-labelledby="filter-tab-groups"
            className={sheetStyles.panel}
          >
            <div className={styles.chips} role="group" aria-label={ui.album.filterTabGroups}>
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
        )}

        {activeTab === 'countries' && (
          <div
            id="filter-panel-countries"
            role="tabpanel"
            aria-labelledby="filter-tab-countries"
            className={sheetStyles.panel}
          >
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
            <div className={styles.chips} role="group" aria-label={ui.album.filterTabCountries}>
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
        )}
      </div>
    </Modal>
  );
}
