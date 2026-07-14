import type { Album } from '../entities/Album.js';
import type { Country } from '../entities/Country.js';
import type { Group } from '../entities/Group.js';
import type { Sticker } from '../entities/Sticker.js';

export interface CatalogRepository {
  getAlbum(): Album;
  findAllStickers(): Promise<Sticker[]>;
  findAllCountries(): Promise<Country[]>;
  findAllGroups(): Promise<Group[]>;
  countStickers(): Promise<number>;
}
