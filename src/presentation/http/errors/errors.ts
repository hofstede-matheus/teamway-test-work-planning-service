import { HttpException } from '@nestjs/common';
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
    default:
      console.error('ERROR NOT MAPPED', error);
      return new HttpException('Internal server error', 500);
  }
}
