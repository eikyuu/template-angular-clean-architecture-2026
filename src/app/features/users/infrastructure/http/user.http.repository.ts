import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { InfrastructureError } from '@core/errors/infrastructure.error';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { CreateUserDto, UserDto } from './user.dto';
import { toUser } from './user.mapper';

@Injectable()
export class HttpUserRepository implements UserRepository {
  private readonly http = inject(HttpClient);
  private readonly basePath = '/users';

  async findAll(): Promise<readonly User[]> {
    try {
      const dtos = await firstValueFrom(this.http.get<UserDto[]>(this.basePath));
      return dtos.map(toUser);
    } catch (e) {
      throw new InfrastructureError('Failed to fetch users', e);
    }
  }

  async findById(id: UserId): Promise<User | null> {
    try {
      const dto = await firstValueFrom(
        this.http.get<UserDto>(`${this.basePath}/${id.value}`),
      );
      return toUser(dto);
    } catch (e) {
      if (isNotFound(e)) return null;
      throw new InfrastructureError(`Failed to fetch user ${id.value}`, e);
    }
  }

  async create(input: CreateUserDto): Promise<User> {
    try {
      const dto = await firstValueFrom(
        this.http.post<UserDto>(this.basePath, input),
      );
      return toUser(dto);
    } catch (e) {
      throw new InfrastructureError('Failed to create user', e);
    }
  }
}

function isNotFound(e: unknown): boolean {
  return typeof e === 'object' && e !== null && 'status' in e && (e as { status: number }).status === 404;
}
