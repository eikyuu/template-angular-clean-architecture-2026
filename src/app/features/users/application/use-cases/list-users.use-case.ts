import { Injectable, inject } from '@angular/core';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Injectable()
export class ListUsersUseCase {
  private readonly repo = inject(USER_REPOSITORY);

  execute(): Promise<readonly User[]> {
    return this.repo.findAll();
  }
}
