import type { CatalogRepository } from '../domain/repositories/CatalogRepository.js';
import type { ListStickersInput, StickerDTO } from './CatalogDTO.js';
import { buildCountriesMap, toStickerDTO } from './CatalogMapper.js';
import { matchesStickerSearch } from './matchesStickerSearch.js';

export class ListStickersUseCase {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(
    input: ListStickersInput = {},
    countsByStickerId?: Map<string, number>,
  ): Promise<StickerDTO[]> {
    const [stickers, countries] = await Promise.all([
      this.catalogRepository.findAllStickers(),
      this.catalogRepository.findAllCountries(),
    ]);

    const countriesById = buildCountriesMap(countries);

    let filtered = stickers;

    if (input.group) {
      filtered = filtered.filter((sticker) => sticker.group === input.group);
    }

    if (input.search?.trim()) {
      filtered = filtered.filter((sticker) => matchesStickerSearch(sticker, input.search!));
    }

    return filtered.map((sticker) => {
      const count = countsByStickerId?.get(sticker.id.value);
      return toStickerDTO(sticker, countriesById, countsByStickerId ? (count ?? 0) : undefined);
    });
  }
}
