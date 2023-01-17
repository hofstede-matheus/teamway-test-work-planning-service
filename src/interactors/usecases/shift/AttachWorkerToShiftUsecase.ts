import { Inject, Injectable } from '@nestjs/common';
import { ShiftEntity } from '../../../domain/entities/Shift.entity';
import { WorkerNotFoundError } from '../../../domain/errors/domain-errors';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { WorkerRepository } from '../../../domain/repositories/WorkerRepository';
import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors';
import { UseCase } from '../../../shared/helpers/usecase';
import { Validator } from '../../../shared/helpers/validator';

@Injectable()
export class AttachWorkerToShiftUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
    @Inject(ShiftRepository)
    private shiftRepository: ShiftRepository,
  ) {}
  async execute(
    workerId: string,
    shiftStart: Date,
    shiftEnd: Date,
  ): Promise<Either<DomainError, ShiftEntity>> {
    const workerValidation = Validator.validate({ id: [workerId] });
    if (workerValidation.isLeft()) return left(workerValidation.value);

    const worker = await this.workerRepository.findById(workerId);

    if (!worker) return left(new WorkerNotFoundError());

    const shiftEntity = ShiftEntity.build(shiftStart, shiftEnd, worker);
    if (shiftEntity.isLeft()) return left(shiftEntity.value);

    const shift = await this.shiftRepository.findByWorkDay(
      shiftEntity.value.workDay,
    );

    const shiftAvailability = ShiftEntity.checkIfShiftSlotIsAvailableForWorker(
      shiftEntity.value.worker,
      shift,
    );

    if (shiftAvailability.isLeft()) return left(shiftAvailability.value);

    const shiftEntityFromDatabase = await this.shiftRepository.create(
      shiftEntity.value.shiftSlot,
      shiftEntity.value.workDay,
      shiftEntity.value.worker,
    );

    return right(shiftEntityFromDatabase);
  }
}
