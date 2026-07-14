import type { CatalogRepository } from '../domain/repositories/CatalogRepository.js';
import type { CountryDTO } from './CatalogDTO.js';
import { toCountryDTO } from './CatalogMapper.js';

export class ListCountriesUseCase {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(): Promise<CountryDTO[]> {
    const countries = await this.catalogRepository.findAllCountries();
    return countries.map(toCountryDTO);
  }
}
