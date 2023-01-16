import { Test, TestingModule } from '@nestjs/testing';
import { WorkerEntity } from '../../../src/domain/entities/Worker.entity';
import {
  InvalidIdError,
  InvalidNameError,
} from '../../../src/domain/errors/domain-errors';
import { WorkerRepository } from '../../../src/domain/repositories/WorkerRepository';
import { UpdateWorkerUsecase } from '../../../src/interactors/usecases/UpdateWorkerUsecase';
import { ALL_REPOSITORIES_PROVIDERS, VALID_WORKER } from '../../helpers';

describe('UpdateWorkerUsecase', () => {
  let useCase: UpdateWorkerUsecase;
  let workerRepository: WorkerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, UpdateWorkerUsecase],
    }).compile();

    workerRepository = module.get<WorkerRepository>(WorkerRepository);

    useCase = module.get(UpdateWorkerUsecase);
  });

  it('should NOT be able to update worker with invalid id', async () => {
    const response = await useCase.execute('INVALID_ID', {
      name: VALID_WORKER.name,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidIdError);
  });

  it('should NOT be able to update worker with invalid name', async () => {
    const response = await useCase.execute(VALID_WORKER.id, { name: 'a' });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should be able to update worker', async () => {
    jest.spyOn(workerRepository, 'update').mockResolvedValue({
      id: VALID_WORKER.id,
      name: VALID_WORKER.name + '_updated',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await useCase.execute(VALID_WORKER.id, {
      name: VALID_WORKER.name,
    });

    expect(response.isRight()).toBeTruthy();
    expect((response.value as WorkerEntity).name).toBe(
      VALID_WORKER.name + '_updated',
    );
  });
});
