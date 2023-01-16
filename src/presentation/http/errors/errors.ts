import { HttpException } from '@nestjs/common';
import {
  InvalidIdError,
  InvalidNameError,
  UserNotFoundError,
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

    case UserNotFoundError:
      return new PresentationException(error, 404);

    default:
      console.error('ERROR NOT MAPPED', error);
      return new HttpException('Internal server error', 500);
  }
}
