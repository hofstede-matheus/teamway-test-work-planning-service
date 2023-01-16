import { DomainError } from '../../shared/helpers/errors';

export class InvalidIdError extends DomainError {}
export class InvalidNameError extends DomainError {}
export class UserNotFoundError extends DomainError {}
