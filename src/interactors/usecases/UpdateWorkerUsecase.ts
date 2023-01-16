import { Inject, Injectable } from '@nestjs/common';
import { WorkerEntity } from '../../domain/entities/Worker.entity';
import { WorkerRepository } from '../../domain/repositories/WorkerRepository';
import { Either } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';

@Injectable()
export class UpdateWorkerUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
  ) {}
  execute(
    workerId: string,
    updateFields: Pick<Partial<WorkerEntity>, 'name'>,
  ): Promise<Either<DomainError, WorkerEntity>> {
    throw new Error('Method not implemented.');
  }
}
