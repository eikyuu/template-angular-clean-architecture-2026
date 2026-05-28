import { Injectable, inject } from '@angular/core';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Injectable()
export class GetUserByIdUseCase {
  private readonly repo = inject(USER_REPOSITORY);

  async execute(id: UserId): Promise<User> {
    const user = await this.repo.findById(id);
    if (user === null) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}
