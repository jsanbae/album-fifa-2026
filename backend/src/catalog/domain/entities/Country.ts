import { DomainError } from '@album/common';

export class Country {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly isoCode: string,
    readonly groupId: string,
    readonly albumId: string,
  ) {}

  static create(
    id: string,
    name: string,
    isoCode: string,
    groupId: string,
    albumId: string,
  ): Country {
    if (!id.trim()) {
      throw DomainError.createValidation('Country id cannot be empty');
    }
    if (!name.trim()) {
      throw DomainError.createValidation('Country name cannot be empty');
    }
    if (!isoCode.trim()) {
      throw DomainError.createValidation('Country isoCode cannot be empty');
    }
    return new Country(id, name, isoCode, groupId, albumId);
  }
}
