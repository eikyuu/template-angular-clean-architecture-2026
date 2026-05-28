import { DomainError } from '@core/errors/domain.error';

export class InvalidEmailError extends DomainError {
  constructor(readonly input: string) {
    super(`"${input}" is not a valid email address`);
  }
}
