import { Test, TestingModule } from '@nestjs/testing';
import {
  InvalidIdError,
  InvalidShiftSlotError,
  WorkerHasShiftsOnDayError,
  WorkerNotFoundError,
} from '../../../src/domain/errors/domain-errors';
import { ShiftRepository } from '../../../src/domain/repositories/ShiftRepository';
import { WorkerRepository } from '../../../src/domain/repositories/WorkerRepository';
import { AttachWorkerToShiftUsecase } from '../../../src/interactors/usecases/shift/AttachWorkerToShiftUsecase';
import {
  ALL_REPOSITORIES_PROVIDERS,
  END_DATE,
  START_DATE,
  VALID_SHIFT,
  VALID_WORKER,
} from '../../helpers';

describe('AttachWorkerToShiftUsecase', () => {
  let useCase: AttachWorkerToShiftUsecase;
  let workerRepository: WorkerRepository;
  let shiftRepository: ShiftRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, AttachWorkerToShiftUsecase],
    }).compile();

    workerRepository = module.get<WorkerRepository>(WorkerRepository);
    shiftRepository = module.get<ShiftRepository>(ShiftRepository);

    useCase = module.get(AttachWorkerToShiftUsecase);
  });

  it('should NOT create a shift with invalid worker id', async () => {
    const response = await useCase.execute('a', START_DATE, END_DATE);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidIdError);
  });

  it('should NOT create shift with invalid start date', async () => {
    jest.spyOn(workerRepository, 'findById').mockResolvedValue(VALID_WORKER);

    const response = await useCase.execute(
      VALID_WORKER.id,
      new Date(2023, 1, 17, 2, 0, 0, 0),
      END_DATE,
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidShiftSlotError);
  });

  it('should NOT create shift with invalid end date', async () => {
    jest.spyOn(workerRepository, 'findById').mockResolvedValue(VALID_WORKER);

    const response = await useCase.execute(
      VALID_WORKER.id,
      START_DATE,
      new Date(2023, 1, 17, 2, 0, 0, 0),
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidShiftSlotError);
  });

  it('should NOT create shift when worker does not exists', async () => {
    jest.spyOn(workerRepository, 'findById').mockResolvedValue(undefined);

    const response = await useCase.execute(
      VALID_WORKER.id,
      START_DATE,
      END_DATE,
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(WorkerNotFoundError);
  });

  it('should NOT create shift when worker already has a shift on the day', async () => {
    jest.spyOn(workerRepository, 'findById').mockResolvedValue(VALID_WORKER);
    jest.spyOn(shiftRepository, 'findByWorkDay').mockResolvedValue({
      date: new Date(2023, 1, 17),
      shifts: {
        first: VALID_SHIFT,
      },
    });

    const response = await useCase.execute(
      VALID_WORKER.id,
      START_DATE,
      END_DATE,
    );

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(WorkerHasShiftsOnDayError);
  });

  it('should create shift', async () => {
    jest.spyOn(workerRepository, 'findById').mockResolvedValue(VALID_WORKER);
    jest.spyOn(shiftRepository, 'findByWorkDay').mockResolvedValue({
      date: new Date(2023, 1, 17),
      shifts: {},
    });

    jest.spyOn(shiftRepository, 'create').mockResolvedValue(VALID_SHIFT);

    const response = await useCase.execute(
      VALID_WORKER.id,
      START_DATE,
      END_DATE,
    );

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toBe(VALID_SHIFT);
  });
});
