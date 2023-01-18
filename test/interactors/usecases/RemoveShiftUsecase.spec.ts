import { Test, TestingModule } from '@nestjs/testing';
import { InvalidIdError } from '../../../src/domain/errors/domain-errors';
import { ShiftRepository } from '../../../src/domain/repositories/ShiftRepository';
import { RemoveShiftUsecase } from '../../../src/interactors/usecases/shift/RemoveShiftUsecase';
import {
  ALL_REPOSITORIES_PROVIDERS,
  VALID_SHIFT_FIRST_SLOT,
} from '../../helpers';

describe('RemoveShiftUsecase', () => {
  let useCase: RemoveShiftUsecase;
  let shiftRepository: ShiftRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...ALL_REPOSITORIES_PROVIDERS, RemoveShiftUsecase],
    }).compile();

    shiftRepository = module.get<ShiftRepository>(ShiftRepository);

    useCase = module.get(RemoveShiftUsecase);
  });

  it('should NOT remove shift with invalid id', async () => {
    const response = await useCase.execute('INVALID_ID');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidIdError);
  });

  it('should remove shift with valid id', async () => {
    jest.spyOn(shiftRepository, 'remove').mockResolvedValue();
    const response = await useCase.execute(VALID_SHIFT_FIRST_SLOT.id);

    expect(response.isRight()).toBeTruthy();
  });
});
