import { Inject, Injectable } from '@nestjs/common';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { Either } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors';
import { UseCase } from '../../../shared/helpers/usecase';

@Injectable()
export class RemoveShiftUsecase implements UseCase {
  constructor(
    @Inject(ShiftRepository)
    private shiftRepository: ShiftRepository,
  ) {}
  execute(id: string): Promise<Either<DomainError, void>> {
    throw new Error('Method not implemented.');
  }
}
