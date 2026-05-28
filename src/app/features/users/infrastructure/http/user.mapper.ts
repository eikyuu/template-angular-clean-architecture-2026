import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserDto } from './user.dto';

export function toUser(dto: UserDto): User {
  return new User(
    UserId.create(dto.id),
    Email.create(dto.email),
    dto.name,
    new Date(dto.created_at),
  );
}
