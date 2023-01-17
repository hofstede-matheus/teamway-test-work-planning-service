import { HttpException } from '@nestjs/common';
import {
  InvalidIdError,
  InvalidNameError,
  InvalidShiftSlotError,
  ShiftAlreadyTakenError,
  WorkerHasShiftsOnDayError,
  WorkerNotFoundError,
} from '../../../domain/errors/domain-errors';
import { DomainError } from '../../../shared/helpers/errors';

export class PresentationException extends HttpException {
  constructor(error: DomainError, statusCode: number) {
    super(
      { error: error.constructor.name, message: error.message },
      statusCode,
    );
  }
}

export function toPresentationError(error: DomainError): HttpException {
  switch (error.constructor) {
    case InvalidIdError:
      return new PresentationException(error, 400);

    case InvalidNameError:
      return new PresentationException(error, 400);

    case WorkerNotFoundError:
      return new PresentationException(error, 404);

    case InvalidShiftSlotError:
      return new PresentationException(error, 400);

    case WorkerHasShiftsOnDayError:
      return new PresentationException(error, 400);

    case ShiftAlreadyTakenError:
      return new PresentationException(error, 400);

    default:
      console.error('ERROR NOT MAPPED', error);
      return new HttpException('Internal server error', 500);
  }
}
