export type DomainErrorType = 'validation' | 'notFound' | 'unauthorized' | 'other';

export class DomainError extends Error {
  private constructor(
    readonly type: DomainErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }

  static createValidation(message: string): DomainError {
    return new DomainError('validation', message);
  }

  static createNotFound(message: string): DomainError {
    return new DomainError('notFound', message);
  }

  static createUnauthorized(message: string): DomainError {
    return new DomainError('unauthorized', message);
  }

  static createOther(message: string): DomainError {
    return new DomainError('other', message);
  }
}
