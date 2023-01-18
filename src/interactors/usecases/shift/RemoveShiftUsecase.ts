import { Inject, Injectable } from '@nestjs/common';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { Either, left, right } from '../../../shared/helpers/either';
import { DomainError } from '../../../shared/helpers/errors';
import { UseCase } from '../../../shared/helpers/usecase';
import { Validator } from '../../../shared/helpers/validator';

@Injectable()
export class RemoveShiftUsecase implements UseCase {
  constructor(
    @Inject(ShiftRepository)
    private shiftRepository: ShiftRepository,
  ) {}
  async execute(id: string): Promise<Either<DomainError, void>> {
    const validation = Validator.validate({ id: [id] });
    if (validation.isLeft()) return left(validation.value);

    await this.shiftRepository.remove(id);

    return right();
  }
}
