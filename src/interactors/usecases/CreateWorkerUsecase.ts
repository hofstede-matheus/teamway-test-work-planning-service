import { Inject, Injectable } from '@nestjs/common';
import { WorkerEntity } from '../../domain/entities/Worker.entity';
import { WorkerRepository } from '../../domain/repositories/WorkerRepository';
import { Either, left, right } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';

@Injectable()
export class CreateWorkerUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
  ) {}

  async execute(name: string): Promise<Either<DomainError, WorkerEntity>> {
    const validation = WorkerEntity.build(name);
    if (validation.isLeft()) return left(validation.value);

    const worker = await this.workerRepository.create(name);

    return right(worker);
  }
}
