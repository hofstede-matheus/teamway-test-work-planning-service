import { Inject, Injectable } from '@nestjs/common';
import { WorkerEntity } from '../../domain/entities/Worker.entity';
import { UserNotFoundError } from '../../domain/errors/domain-errors';
import { WorkerRepository } from '../../domain/repositories/WorkerRepository';
import { Either, left, right } from '../../shared/helpers/either';
import { DomainError } from '../../shared/helpers/errors';
import { UseCase } from '../../shared/helpers/usecase';
import { Validator } from '../../shared/helpers/validator';

interface FindWorkersUsecaseParams {
  workerId?: string;
  nameQuery?: string;
}

@Injectable()
export class FindWorkersUsecase implements UseCase {
  constructor(
    @Inject(WorkerRepository)
    private workerRepository: WorkerRepository,
  ) {}
  async execute({
    workerId,
    nameQuery,
  }: FindWorkersUsecaseParams): Promise<Either<DomainError, WorkerEntity[]>> {
    if (workerId) {
      const validation = Validator.validate({ id: [workerId] });
      if (validation.isLeft()) return left(validation.value);

      const worker = await this.workerRepository.findById(workerId);

      if (!worker) return left(new UserNotFoundError());

      return right([worker]);
    } else if (nameQuery) {
      const entityValidation = WorkerEntity.build(nameQuery);
      if (entityValidation.isLeft()) return left(entityValidation.value);

      const workers = await this.workerRepository.findByName(nameQuery);

      return right(workers);
    } else {
      const workers = await this.workerRepository.findAll();

      return right(workers);
    }
  }
}
