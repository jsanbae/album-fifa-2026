import { DomainError } from '@album/common';

export class Group {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly albumId: string,
  ) {}

  static create(id: string, name: string, albumId: string): Group {
    if (!id.trim()) {
      throw DomainError.createValidation('Group id cannot be empty');
    }
    if (!name.trim()) {
      throw DomainError.createValidation('Group name cannot be empty');
    }
    return new Group(id, name, albumId);
  }

  static normalizeIdFromName(name: string): string {
    if (name === 'FIFA World Cup') {
      return 'fifa-world-cup';
    }
    if (name === 'Coca-Cola') {
      return 'coca-cola';
    }
    const match = /^Grupo ([A-L])$/.exec(name);
    if (match) {
      return match[1];
    }
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
