import { DomainError } from '@core/errors/domain.error';
import { UserId } from '../value-objects/user-id.vo';

export class UserNotFoundError extends DomainError {
  constructor(readonly id: UserId) {
    super(`User "${id.value}" not found`);
  }
}
