import { Test, TestingModule } from '@nestjs/testing';
import {
  InvalidIdError,
  InvalidNameError,
} from '../../../src/domain/errors/domain-errors';
import { WorkerRepository } from '../../../src/domain/repositories/WorkerRepository';
import { FindWorkersUsecase } from '../../../src/interactors/usecases/FindWorkersUsecase';
import { ALL_REPOSITORIES_PROVIDERS, VALID_WORKER } from '../../helpers';

describe('FindWorkersUsecase', () => {
  let useCase: FindWorkersUsecase;
  let workerRepository: WorkerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, FindWorkersUsecase],
    }).compile();

    workerRepository = module.get<WorkerRepository>(WorkerRepository);

    useCase = module.get(FindWorkersUsecase);
  });

  it('should NOT be able to find a single worker with invalid id', async () => {
    const response = await useCase.execute({ workersId: 'INVALID_ID' });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidIdError);
  });

  it('should NOT be able to find workers with invalid name', async () => {
    const response = await useCase.execute({ nameQuery: 'a' });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should be able to find a single worker by id', async () => {
    jest.spyOn(workerRepository, 'findById').mockResolvedValue({
      id: VALID_WORKER.id,
      name: VALID_WORKER.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await useCase.execute({ workersId: VALID_WORKER.id });

    expect(response.isRight()).toBeTruthy();
  });

  it('should be able to find all workers', async () => {
    jest.spyOn(workerRepository, 'findAll').mockResolvedValue([VALID_WORKER]);
    const response = await useCase.execute({});

    expect(response.isRight()).toBeTruthy();
  });

  it('should be able to find workers by name', async () => {
    jest
      .spyOn(workerRepository, 'findByName')
      .mockResolvedValue([VALID_WORKER]);
    const response = await useCase.execute({ nameQuery: VALID_WORKER.name });

    expect(response.isRight()).toBeTruthy();
  });
});
