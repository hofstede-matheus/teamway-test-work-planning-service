import { Inject, Injectable } from '@nestjs/common';
import { WorkDay } from '../../../domain/entities/Shift.entity';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { Either, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors';
import { UseCase } from '../../../shared/helpers/usecase';

@Injectable()
export class FindShiftsFromDayUsecase implements UseCase {
  constructor(
    @Inject(ShiftRepository)
    private shiftRepository: ShiftRepository,
  ) {}
  async execute(date: Date): Promise<Either<DomainError, WorkDay>> {
    const workDay = await this.shiftRepository.findByWorkDay(date);
    return right(workDay);
  }
}
