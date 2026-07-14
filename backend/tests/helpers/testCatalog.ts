import { ALBUM_ID } from '@album/common';
import { Album } from '../../src/catalog/domain/entities/Album.js';
import { Country } from '../../src/catalog/domain/entities/Country.js';
import { Group } from '../../src/catalog/domain/entities/Group.js';
import { Sticker } from '../../src/catalog/domain/entities/Sticker.js';
import { StickerNumber } from '../../src/catalog/domain/entities/StickerNumber.js';
import { InMemoryCatalogRepository } from '../../src/catalog/domain/repositories/InMemoryCatalogRepository.js';

export function createTestCatalogRepository(): InMemoryCatalogRepository {
  const album = Album.create(ALBUM_ID, 'FIFA World Cup 2026');
  const groups = [
    Group.create('fifa-world-cup', 'FIFA World Cup', ALBUM_ID),
    Group.create('A', 'Grupo A', ALBUM_ID),
    Group.create('coca-cola', 'Coca-Cola', ALBUM_ID),
  ];
  const countries = [
    Country.create('MEX', 'México', 'MX', 'A', ALBUM_ID),
    Country.create('USA', 'Estados Unidos', 'US', 'A', ALBUM_ID),
  ];
  const stickers = [
    Sticker.create(StickerNumber.create('FWC1'), 'FWC Sticker', null, 'FIFA World Cup', ALBUM_ID),
    Sticker.create(StickerNumber.create('MEX1'), 'MEX Player 1', 'MEX', 'Grupo A', ALBUM_ID),
    Sticker.create(StickerNumber.create('MEX2'), 'MEX Player 2', 'MEX', 'Grupo A', ALBUM_ID),
    Sticker.create(StickerNumber.create('USA1'), 'USA Player 1', 'USA', 'Grupo A', ALBUM_ID),
    Sticker.create(StickerNumber.create('CC1'), 'Lamine Yamal', null, 'Coca-Cola', ALBUM_ID),
  ];

  return InMemoryCatalogRepository.create(album, stickers, countries, groups);
}
