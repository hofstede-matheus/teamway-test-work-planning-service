import { Inject, Injectable } from '@nestjs/common';
import { WorkerRepository } from '../../domain/repositories/WorkerRepository';
import { Either } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';

@Injectable()
export class RemoveWorkerUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
  ) {}
  execute(id: string): Promise<Either<DomainError, void>> {
    throw new Error('Method not implemented.');
  }
}
