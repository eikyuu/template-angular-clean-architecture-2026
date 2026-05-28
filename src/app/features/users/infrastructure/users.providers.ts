import { Provider } from '@angular/core';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UsersStore } from '../application/store/users.store';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';
import { HttpUserRepository } from './http/user.http.repository';

export const usersProviders: Provider[] = [
  { provide: USER_REPOSITORY, useClass: HttpUserRepository },
  ListUsersUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UsersStore,
];
