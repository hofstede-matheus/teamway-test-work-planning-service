import { Inject, Injectable } from '@nestjs/common';
import { WorkDay } from '../../../domain/entities/Shift.entity';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { Either } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors';
import { UseCase } from '../../../shared/helpers/usecase';

@Injectable()
export class FindShiftsFromDayUsecase implements UseCase {
  constructor(
    @Inject(ShiftRepository)
    private shiftRepository: ShiftRepository,
  ) {}
  execute(date: Date): Promise<Either<DomainError, WorkDay>> {
    throw new Error('Method not implemented.');
  }
}
