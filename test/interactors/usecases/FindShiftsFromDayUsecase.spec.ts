import { Test, TestingModule } from '@nestjs/testing';
import { ShiftRepository } from '../../../src/domain/repositories/ShiftRepository';
import { FindShiftsFromDayUsecase } from '../../../src/interactors/usecases/shift/FindShiftsFromDayUsecase';
import {
  ALL_REPOSITORIES_PROVIDERS,
  START_DATE,
  VALID_SHIFT_FIRST_SLOT,
  VALID_SHIFT_SECOND_SLOT,
} from '../../helpers';

describe('FindShiftsFromDayUsecase', () => {
  let useCase: FindShiftsFromDayUsecase;
  let shiftRepository: ShiftRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, FindShiftsFromDayUsecase],
    }).compile();

    shiftRepository = module.get<ShiftRepository>(ShiftRepository);

    useCase = module.get(FindShiftsFromDayUsecase);
  });

  it('should find shifts from a day', async () => {
    jest.spyOn(shiftRepository, 'findByWorkDay').mockResolvedValue({
      date: START_DATE,
      shifts: [VALID_SHIFT_FIRST_SLOT, VALID_SHIFT_SECOND_SLOT],
    });
    const response = await useCase.execute(START_DATE);

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toStrictEqual({
      date: START_DATE,
      shifts: [VALID_SHIFT_FIRST_SLOT, VALID_SHIFT_SECOND_SLOT],
    });
  });
});
