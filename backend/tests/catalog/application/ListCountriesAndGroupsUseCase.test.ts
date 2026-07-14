import { describe, expect, it } from 'vitest';
import { ListCountriesUseCase } from '../../../src/catalog/application/ListCountriesUseCase.js';
import { ListGroupsUseCase } from '../../../src/catalog/application/ListGroupsUseCase.js';
import { createTestCatalogRepository } from '../../helpers/testCatalog.js';

describe('ListCountriesUseCase', () => {
  it('lists countries with group id', async () => {
    const useCase = new ListCountriesUseCase(createTestCatalogRepository());
    const countries = await useCase.execute();
    expect(countries).toHaveLength(2);
    expect(countries[0]).toMatchObject({ id: 'MEX', groupId: 'A', isoCode: 'MX' });
  });
});

describe('ListGroupsUseCase', () => {
  it('lists groups in display order', async () => {
    const useCase = new ListGroupsUseCase(createTestCatalogRepository());
    const groups = await useCase.execute();
    expect(groups.map((g) => g.name)).toEqual(['FIFA World Cup', 'Grupo A', 'Coca-Cola']);
  });
});
