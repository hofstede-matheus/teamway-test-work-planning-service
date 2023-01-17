import { Body, Controller, Post } from '@nestjs/common';
import { AttachWorkerToShiftUsecase } from '../../../interactors/usecases/shift/AttachWorkerToShiftUsecase';
import { CreateShiftRequest, CreateShiftResponse } from '../dto/CreateShift';
import { toPresentationError } from '../errors/errors';

@Controller('shifts')
export class ShiftsControllers {
  constructor(
    private readonly attachWorkerToShiftUsecase: AttachWorkerToShiftUsecase,
  ) {}

  @Post()
  async createShift(
    @Body() body: CreateShiftRequest,
  ): Promise<CreateShiftResponse> {
    const result = await this.attachWorkerToShiftUsecase.execute(
      body.workerId,
      body.shiftStart,
      body.shiftEnd,
    );

    if (result.isLeft()) throw toPresentationError(result.value);

    return {
      id: result.value.id,
      shiftSlot: result.value.shiftSlot,
      workDay: result.value.workDay,
      createdAt: result.value.createdAt,
      updatedAt: result.value.updatedAt,
    };
  }
}
