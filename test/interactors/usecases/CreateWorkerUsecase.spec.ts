import { Test, TestingModule } from '@nestjs/testing';
import { InvalidNameError } from '../../../src/domain/errors/domain-errors';
import { WorkerRepository } from '../../../src/domain/repositories/WorkerRepository';
import { CreateWorkerUsecase } from '../../../src/interactors/usecases/CreateWorkerUsecase';
import { ALL_REPOSITORIES_PROVIDERS, VALID_WORKER } from '../../helpers';

describe('CreateWorkerUsecase', () => {
  let useCase: CreateWorkerUsecase;
  let workerRepository: WorkerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, CreateWorkerUsecase],
    }).compile();

    workerRepository = module.get<WorkerRepository>(WorkerRepository);

    useCase = module.get(CreateWorkerUsecase);
  });

  it('should not create worker with invalid name', async () => {
    const response = await useCase.execute('a');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should create worker with valid name', async () => {
    jest.spyOn(workerRepository, 'create').mockResolvedValue({
      id: VALID_WORKER.id,
      name: VALID_WORKER.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const response = await useCase.execute(VALID_WORKER.name);

    expect(response.isRight()).toBeTruthy();
    expect(response.value.id).toBe(VALID_WORKER.id);
    expect(response.value.name).toBe(VALID_WORKER.name);
  });
});
