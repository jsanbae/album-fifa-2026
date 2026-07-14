import { DomainError } from '@album/common';

export class UserId {
  private constructor(readonly value: string) {}

  static create(value: string): UserId {
    if (!value || value.trim() === '') {
      throw DomainError.createValidation('User id cannot be empty');
    }
    return new UserId(value);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
