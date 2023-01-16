import { Inject, Injectable } from '@nestjs/common';
import { WorkerEntity } from '../../domain/entities/Worker.entity';
import { WorkerRepository } from '../../domain/repositories/WorkerRepository';
import { Either } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';

interface FindWorkersUsecaseParams {
  workersId?: string;
  nameQuery?: string;
}

@Injectable()
export class FindWorkersUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
  ) {}
  execute({
    workersId,
    nameQuery,
  }: FindWorkersUsecaseParams): Promise<Either<DomainError, WorkerEntity[]>> {
    throw new Error('Method not implemented.');
  }
}
