import { ui } from '../../../../shared/infrastructure/ui/uiStrings.js';
import type { CountryDTO } from '../../adapters/CatalogApiAdapter.js';
import type { OwnershipFilter, ScopeFilter } from '../store/useCatalog.hook.js';

export const OWNERSHIP_FILTERS: OwnershipFilter[] = ['all', 'missing', 'collected', 'duplicates'];

export function ownershipLabel(filter: OwnershipFilter): string {
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

export function sortCountriesByName(countries: CountryDTO[]): CountryDTO[] {
  return [...countries].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

export function scopeLabel(scopeFilter: ScopeFilter, countries: CountryDTO[]): string | null {
  if (scopeFilter.kind === 'group') {
    return scopeFilter.name;
  }
  if (scopeFilter.kind === 'country') {
    return countries.find((country) => country.id === scopeFilter.id)?.name ?? scopeFilter.id;
  }
  return null;
}

export function filterCountriesBySearch(countries: CountryDTO[], query: string): CountryDTO[] {
  const normalized = normalizeForSearch(query);
  if (!normalized) {
    return countries;
  }
  return countries.filter((country) => normalizeForSearch(country.name).includes(normalized));
}

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es');
}

export function hasActiveScope(scopeFilter: ScopeFilter): boolean {
  return scopeFilter.kind !== 'none';
}

export function hasActiveFilters(
  ownershipFilter: OwnershipFilter,
  scopeFilter: ScopeFilter,
): boolean {
  return ownershipFilter !== 'all' || hasActiveScope(scopeFilter);
}
