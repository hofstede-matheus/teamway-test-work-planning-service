import { Inject, Injectable } from '@nestjs/common';
import { WorkDayEntity } from '../../../domain/entities/Shift.entity';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { Either, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors';
import { UseCase } from '../../../shared/helpers/usecase';

@Injectable()
export class FindShiftsByDateRangeUsecase implements UseCase {
  constructor(
    @Inject(ShiftRepository)
    private shiftRepository: ShiftRepository,
  ) {}
  async execute(
    startDate: Date,
    endDate: Date,
  ): Promise<Either<DomainError, WorkDayEntity[]>> {
    const workDay = await this.shiftRepository.findByWorkDays(
      startDate,
      endDate,
    );
    return right(workDay);
  }
}
