import { Injectable, inject } from '@angular/core';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';

export interface CreateUserInput {
  readonly email: string;
  readonly name: string;
}

@Injectable()
export class CreateUserUseCase {
  private readonly repo = inject(USER_REPOSITORY);

  execute(input: CreateUserInput): Promise<User> {
    Email.create(input.email);
    const name = input.name.trim();
    if (name.length === 0) {
      throw new Error('User name cannot be empty');
    }
    return this.repo.create({ email: input.email, name });
  }
}
