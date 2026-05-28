import { describe, expect, it } from 'vitest';
import { UserDto } from './user.dto';
import { toUser } from './user.mapper';

describe('UserMapper', () => {
  const dto: UserDto = {
    id: '42',
    email: 'alice@example.com',
    name: 'Alice',
    created_at: '2024-01-15T10:00:00.000Z',
  };

  it('maps a DTO to a domain entity', () => {
    const user = toUser(dto);
    expect(user.id.value).toBe('42');
    expect(user.email.value).toBe('alice@example.com');
    expect(user.name).toBe('Alice');
    expect(user.createdAt.toISOString()).toBe('2024-01-15T10:00:00.000Z');
  });
});
