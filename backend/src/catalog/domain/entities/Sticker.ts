import { DomainError } from '@album/common';
import { Group } from './Group.js';
import type { StickerNumber } from './StickerNumber.js';

export class Sticker {
  private constructor(
    readonly id: StickerNumber,
    readonly name: string,
    readonly countryId: string | null,
    readonly group: string,
    readonly groupId: string,
    readonly albumId: string,
  ) {}

  static create(
    id: StickerNumber,
    name: string,
    countryId: string | null,
    group: string,
    albumId: string,
  ): Sticker {
    if (!name.trim()) {
      throw DomainError.createValidation('Sticker name cannot be empty');
    }
    const groupId = Group.normalizeIdFromName(group);
    return new Sticker(id, name, countryId, group, groupId, albumId);
  }
}
