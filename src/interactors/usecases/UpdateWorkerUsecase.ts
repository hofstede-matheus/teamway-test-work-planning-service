import { Inject, Injectable } from '@nestjs/common';
import { WorkerEntity } from '../../domain/entities/Worker.entity';
import { WorkerRepository } from '../../domain/repositories/WorkerRepository';
import { Either, left, right } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';
import { Validator } from '../../shared/helpers/validator';

@Injectable()
export class UpdateWorkerUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
  ) {}
  async execute(
    workerId: string,
    updateFields: Pick<Partial<WorkerEntity>, 'name'>,
  ): Promise<Either<DomainError, WorkerEntity>> {
    const entityValidation = WorkerEntity.build(updateFields.name);
    if (entityValidation.isLeft()) return left(entityValidation.value);

    const validation = Validator.validate({ id: [workerId] });
    if (validation.isLeft()) return left(validation.value);

    const worker = await this.workerRepository.update({
      ...updateFields,
      id: workerId,
    });

    return right(worker);
  }
}
