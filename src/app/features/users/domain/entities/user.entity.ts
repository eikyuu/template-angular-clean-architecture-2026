import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

export class User {
  constructor(
    readonly id: UserId,
    readonly email: Email,
    readonly name: string,
    readonly createdAt: Date,
  ) {}

  rename(newName: string): User {
    return new User(this.id, this.email, newName, this.createdAt);
  }
}
