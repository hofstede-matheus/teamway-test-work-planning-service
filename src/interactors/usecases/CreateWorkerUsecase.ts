import { Injectable } from '@nestjs/common';
import { Either } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';

@Injectable()
export class CreateWorkerUsecase implements UseCase {
  execute(name: string): Promise<Either<DomainError, any>> {
    throw new Error('Method not implemented.');
  }
}
