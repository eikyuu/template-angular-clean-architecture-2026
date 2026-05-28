import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';

export class InMemoryUserRepository implements UserRepository {
  private users: User[];
  private nextId = 1;

  constructor(seed: readonly User[] = []) {
    this.users = [...seed];
    this.nextId = seed.length + 1;
  }

  async findAll(): Promise<readonly User[]> {
    return [...this.users];
  }

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((u) => u.id.equals(id)) ?? null;
  }

  async create(input: { readonly email: string; readonly name: string }): Promise<User> {
    const user = new User(
      UserId.create(String(this.nextId++)),
      Email.create(input.email),
      input.name,
      new Date(),
    );
    this.users.push(user);
    return user;
  }
}
