import { DomainError } from '@album/common';

export class Album {
  private constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  static create(id: string, name: string): Album {
    if (!id.trim()) {
      throw DomainError.createValidation('Album id cannot be empty');
    }
    if (!name.trim()) {
      throw DomainError.createValidation('Album name cannot be empty');
    }
    return new Album(id, name);
  }
}
