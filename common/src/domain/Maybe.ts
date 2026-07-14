export class Maybe<T> {
  private constructor(private readonly value: T | null) {}

  static some<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static none<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  isSome(): boolean {
    return this.value !== null;
  }

  isNone(): boolean {
    return this.value === null;
  }

  getOrThrow(): T {
    if (this.value === null) {
      throw new Error('Maybe has no value');
    }
    return this.value;
  }

  getOrElse(defaultValue: T): T {
    return this.value === null ? defaultValue : this.value;
  }

  fold<U>(onNone: () => U, onSome: (value: T) => U): U {
    return this.value === null ? onNone() : onSome(this.value);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value === null ? Maybe.none() : Maybe.some(fn(this.value));
  }
}
