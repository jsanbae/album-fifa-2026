import { Album } from '../entities/Album.js';
import type { Country } from '../entities/Country.js';
import type { Group } from '../entities/Group.js';
import type { Sticker } from '../entities/Sticker.js';
import type { CatalogRepository } from './CatalogRepository.js';

export class InMemoryCatalogRepository implements CatalogRepository {
  private constructor(
    private readonly album: Album,
    private readonly stickers: Sticker[],
    private readonly countries: Country[],
    private readonly groups: Group[],
  ) {}

  static create(
    album: Album,
    stickers: Sticker[],
    countries: Country[],
    groups: Group[],
  ): InMemoryCatalogRepository {
    return new InMemoryCatalogRepository(album, stickers, countries, groups);
  }

  static empty(): InMemoryCatalogRepository {
    return new InMemoryCatalogRepository(
      Album.create('fifa-2026', 'FIFA World Cup 2026'),
      [],
      [],
      [],
    );
  }

  getAlbum(): Album {
    return this.album;
  }

  async findAllStickers(): Promise<Sticker[]> {
    return [...this.stickers];
  }

  async findAllCountries(): Promise<Country[]> {
    return [...this.countries];
  }

  async findAllGroups(): Promise<Group[]> {
    return [...this.groups];
  }

  async countStickers(): Promise<number> {
    return this.stickers.length;
  }
}
