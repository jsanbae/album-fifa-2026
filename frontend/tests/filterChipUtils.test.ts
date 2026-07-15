import { describe, expect, it } from 'vitest';
import { filterCountriesBySearch } from '../src/catalog/infrastructure/ui/components/filterChipUtils.js';

describe('filterChipUtils', () => {
  it('filters countries by Spanish name case-insensitively', () => {
    const countries = [
      { id: 'MEX', name: 'México', isoCode: 'MX', groupId: 'A' },
      { id: 'BRA', name: 'Brasil', isoCode: 'BR', groupId: 'A' },
    ];

    expect(filterCountriesBySearch(countries, 'mex').map((country) => country.id)).toEqual(['MEX']);
  });
});
