import { Test, TestingModule } from '@nestjs/testing';
import { InvalidIdError } from '../../../src/domain/errors/domain-errors';
import { WorkerRepository } from '../../../src/domain/repositories/WorkerRepository';
import { RemoveWorkerUsecase } from '../../../src/interactors/usecases/worker/RemoveWorkerUsecase';
import { ALL_REPOSITORIES_PROVIDERS, VALID_WORKER } from '../../helpers';

describe('RemoveWorkerUsecase', () => {
  let useCase: RemoveWorkerUsecase;
  let workerRepository: WorkerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, RemoveWorkerUsecase],
    }).compile();

    workerRepository = module.get<WorkerRepository>(WorkerRepository);

    useCase = module.get(RemoveWorkerUsecase);
  });

  it('should NOT remove worker with invalid id', async () => {
    const response = await useCase.execute('INVALID_ID');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidIdError);
  });

  it('should remove worker with valid id', async () => {
    jest.spyOn(workerRepository, 'remove').mockResolvedValue();
    const response = await useCase.execute(VALID_WORKER.id);

    expect(response.isRight()).toBeTruthy();
  });
});
