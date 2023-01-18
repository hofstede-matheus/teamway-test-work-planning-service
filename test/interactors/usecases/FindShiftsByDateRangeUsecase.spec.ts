import { Test, TestingModule } from '@nestjs/testing';
import { ShiftRepository } from '../../../src/domain/repositories/ShiftRepository';
import { FindShiftsByDateRangeUsecase } from '../../../src/interactors/usecases/shift/FindShiftsByDateRangeUsecase';
import { FindShiftsFromDayUsecase } from '../../../src/interactors/usecases/shift/FindShiftsFromDayUsecase';
import {
  ALL_REPOSITORIES_PROVIDERS,
  END_DATE,
  START_DATE,
  VALID_SHIFT_FIRST_SLOT,
  VALID_SHIFT_SECOND_SLOT,
} from '../../helpers';

describe('FindShiftsByDateRangeUsecase', () => {
  let useCase: FindShiftsByDateRangeUsecase;
  let shiftRepository: ShiftRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, FindShiftsByDateRangeUsecase],
    }).compile();

    shiftRepository = module.get<ShiftRepository>(ShiftRepository);

    useCase = module.get(FindShiftsByDateRangeUsecase);
  });

  it('should find shifts from range', async () => {
    jest.spyOn(shiftRepository, 'findByWorkDays').mockResolvedValue([
      {
        date: START_DATE,
        shifts: [VALID_SHIFT_FIRST_SLOT, VALID_SHIFT_SECOND_SLOT],
      },
      {
        date: START_DATE,
        shifts: [VALID_SHIFT_FIRST_SLOT, VALID_SHIFT_SECOND_SLOT],
      },
    ]);
    const response = await useCase.execute(START_DATE, END_DATE);

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toStrictEqual([
      {
        date: START_DATE,
        shifts: [VALID_SHIFT_FIRST_SLOT, VALID_SHIFT_SECOND_SLOT],
      },
      {
        date: START_DATE,
        shifts: [VALID_SHIFT_FIRST_SLOT, VALID_SHIFT_SECOND_SLOT],
      },
    ]);
  });
});
