import type { Country } from '../domain/entities/Country.js';
import type { Group } from '../domain/entities/Group.js';
import type { Sticker } from '../domain/entities/Sticker.js';
import type { CountryDTO, GroupDTO, StickerDTO } from './CatalogDTO.js';

export function toStickerDTO(
  sticker: Sticker,
  countriesById: Map<string, Country>,
  count?: number,
): StickerDTO {
  const country = sticker.countryId ? countriesById.get(sticker.countryId) : undefined;
  const dto: StickerDTO = {
    id: sticker.id.value,
    name: sticker.name,
    countryId: sticker.countryId,
    group: sticker.group,
    countryName: country?.name ?? null,
    isoCode: country?.isoCode ?? null,
  };
  if (count !== undefined) {
    dto.count = count;
  }
  return dto;
}

export function toCountryDTO(country: Country): CountryDTO {
  return {
    id: country.id,
    name: country.name,
    isoCode: country.isoCode,
    groupId: country.groupId,
  };
}

export function toGroupDTO(group: Group): GroupDTO {
  return {
    id: group.id,
    name: group.name,
  };
}

export function buildCountriesMap(countries: Country[]): Map<string, Country> {
  return new Map(countries.map((country) => [country.id, country]));
}
