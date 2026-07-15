import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { CountryDTO } from '../../adapters/CatalogApiAdapter.js';
import type { OwnershipFilter, ScopeFilter } from '../store/useCatalog.hook.js';
import {
  hasActiveFilters,
  ownershipLabel,
  scopeLabel,
} from './filterChipUtils.js';
import styles from './ActiveFilterPills.module.css';

interface ActiveFilterPillsProps {
  ownershipFilter: OwnershipFilter;
  scopeFilter: ScopeFilter;
  countries: CountryDTO[];
  onClearOwnership: () => void;
  onClearScope: () => void;
}

export function ActiveFilterPills(props: ActiveFilterPillsProps) {
  if (!hasActiveFilters(props.ownershipFilter, props.scopeFilter)) {
    return null;
  }

  const scope = scopeLabel(props.scopeFilter, props.countries);

  return (
    <section className={styles.container} aria-label={ui.album.filterActive}>
      <div className={styles.pills}>
        {props.ownershipFilter !== 'all' && (
          <button
            type="button"
            className={styles.pill}
            onClick={props.onClearOwnership}
            aria-label={`${ui.album.filterRemove} ${ownershipLabel(props.ownershipFilter)}`}
          >
            <span>{ownershipLabel(props.ownershipFilter)}</span>
            <span className={styles.dismiss} aria-hidden="true">
              ×
            </span>
          </button>
        )}
        {scope && (
          <button
            type="button"
            className={styles.pill}
            onClick={props.onClearScope}
            aria-label={`${ui.album.filterRemove} ${scope}`}
          >
            <span>{scope}</span>
            <span className={styles.dismiss} aria-hidden="true">
              ×
            </span>
          </button>
        )}
      </div>
      {scope && (
        <button type="button" className={styles.clearScope} onClick={props.onClearScope}>
          {ui.album.filterClearScope}
        </button>
      )}
    </section>
  );
}
