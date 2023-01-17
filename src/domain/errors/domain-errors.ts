import { DomainError } from '../../shared/helpers/errors';

export class InvalidIdError extends DomainError {}
export class InvalidNameError extends DomainError {}
export class WorkerNotFoundError extends DomainError {}
export class InvalidShiftSlotError extends DomainError {}
export class WorkerHasShiftsOnDayError extends DomainError {}
