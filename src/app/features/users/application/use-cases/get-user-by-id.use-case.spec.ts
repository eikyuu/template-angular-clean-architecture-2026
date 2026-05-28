import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { InMemoryUserRepository } from '../../infrastructure/fakes/user.in-memory.repository';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;

  beforeEach(() => {
    const seed = [
      new User(UserId.create('1'), Email.create('a@b.com'), 'Alice', new Date()),
    ];
    TestBed.configureTestingModule({
      providers: [
        GetUserByIdUseCase,
        { provide: USER_REPOSITORY, useValue: new InMemoryUserRepository(seed) },
      ],
    });
    useCase = TestBed.inject(GetUserByIdUseCase);
  });

  it('returns the user when found', async () => {
    const user = await useCase.execute(UserId.create('1'));
    expect(user.name).toBe('Alice');
  });

  it('throws UserNotFoundError when missing', async () => {
    await expect(useCase.execute(UserId.create('999'))).rejects.toThrow(UserNotFoundError);
  });
});
