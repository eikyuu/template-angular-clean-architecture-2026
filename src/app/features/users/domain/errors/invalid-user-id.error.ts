import { DomainError } from '@core/errors/domain.error';

export class InvalidUserIdError extends DomainError {
  constructor(readonly input: string) {
    super(`"${input}" is not a valid user id`);
  }
}
