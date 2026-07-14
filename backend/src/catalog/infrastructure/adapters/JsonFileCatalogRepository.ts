import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALBUM_ID, DomainError } from '@album/common';
import { Album } from '../../domain/entities/Album.js';
import { Country } from '../../domain/entities/Country.js';
import { Group } from '../../domain/entities/Group.js';
import { Sticker } from '../../domain/entities/Sticker.js';
import { StickerNumber } from '../../domain/entities/StickerNumber.js';
import type { CatalogRepository } from '../../domain/repositories/CatalogRepository.js';

interface StickerRow {
  id: string;
  name: string;
  countryId: string | null;
  group: string;
}

interface CountryRow {
  id: string;
  name: string;
  isoCode: string;
}

export class JsonFileCatalogRepository implements CatalogRepository {
  private constructor(
    private readonly album: Album,
    private readonly stickers: Sticker[],
    private readonly countries: Country[],
    private readonly groups: Group[],
  ) {}

  static create(dataDir?: string): JsonFileCatalogRepository {
    const root = dataDir ?? resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../data');

    let stickersJson: { stickers: StickerRow[] };
    let countriesJson: { countries: CountryRow[] };

    try {
      stickersJson = JSON.parse(readFileSync(resolve(root, 'stickers.json'), 'utf8')) as {
        stickers: StickerRow[];
      };
      countriesJson = JSON.parse(readFileSync(resolve(root, 'countries.json'), 'utf8')) as {
        countries: CountryRow[];
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw DomainError.createOther(`Failed to load catalog JSON: ${message}`);
    }

    const album = Album.create(ALBUM_ID, 'FIFA World Cup 2026');
    const countryToGroup = new Map<string, string>();

    for (const row of stickersJson.stickers) {
      if (row.countryId) {
        const existing = countryToGroup.get(row.countryId);
        if (existing && existing !== row.group) {
          throw DomainError.createValidation(
            `Country ${row.countryId} maps to multiple groups: ${existing} and ${row.group}`,
          );
        }
        countryToGroup.set(row.countryId, row.group);
      }
    }

    const groupNames = [...new Set(stickersJson.stickers.map((row) => row.group))];
    const groups = groupNames.map((name) =>
      Group.create(Group.normalizeIdFromName(name), name, ALBUM_ID),
    );

    const countries = countriesJson.countries.map((row) => {
      const groupName = countryToGroup.get(row.id);
      if (!groupName) {
        throw DomainError.createValidation(`Country ${row.id} is not linked to any sticker group`);
      }
      return Country.create(
        row.id,
        row.name,
        row.isoCode,
        Group.normalizeIdFromName(groupName),
        ALBUM_ID,
      );
    });

    const stickers = stickersJson.stickers.map((row) =>
      Sticker.create(
        StickerNumber.create(row.id),
        row.name,
        row.countryId,
        row.group,
        ALBUM_ID,
      ),
    );

    return new JsonFileCatalogRepository(album, stickers, countries, groups);
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
