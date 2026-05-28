import { InvalidUserIdError } from '../errors/invalid-user-id.error';

export class UserId {
  private constructor(readonly value: string) {}

  static create(input: string): UserId {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      throw new InvalidUserIdError(input);
    }
    return new UserId(trimmed);
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
