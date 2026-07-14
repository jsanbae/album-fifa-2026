import { DomainError } from '@album/common';

export class StickerNumber {
  private constructor(readonly value: string) {}

  static create(value: string): StickerNumber {
    if (!value || value.trim() === '') {
      throw DomainError.createValidation('Sticker id cannot be empty');
    }
    return new StickerNumber(value);
  }

  equals(other: StickerNumber): boolean {
    return this.value === other.value;
  }

  startsWith(prefix: string): boolean {
    return this.value.startsWith(prefix);
  }
}
