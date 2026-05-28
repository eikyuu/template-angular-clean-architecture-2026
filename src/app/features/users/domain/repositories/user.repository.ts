import { InjectionToken } from '@angular/core';
import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';

export interface UserRepository {
  findAll(): Promise<readonly User[]>;
  findById(id: UserId): Promise<User | null>;
  create(input: { readonly email: string; readonly name: string }): Promise<User>;
}

export const USER_REPOSITORY = new InjectionToken<UserRepository>('USER_REPOSITORY');
