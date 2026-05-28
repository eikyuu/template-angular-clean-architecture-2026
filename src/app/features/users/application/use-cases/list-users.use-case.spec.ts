import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { InMemoryUserRepository } from '../../infrastructure/fakes/user.in-memory.repository';
import { ListUsersUseCase } from './list-users.use-case';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;

  beforeEach(() => {
    const seed = [
      new User(UserId.create('1'), Email.create('a@b.com'), 'Alice', new Date('2024-01-01')),
    ];
    TestBed.configureTestingModule({
      providers: [
        ListUsersUseCase,
        { provide: USER_REPOSITORY, useValue: new InMemoryUserRepository(seed) },
      ],
    });
    useCase = TestBed.inject(ListUsersUseCase);
  });

  it('returns all users from the repository', async () => {
    const users = await useCase.execute();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('Alice');
  });
});
