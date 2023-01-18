import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AttachWorkerToShiftUsecase } from '../../../interactors/usecases/shift/AttachWorkerToShiftUsecase';
import { FindShiftsByDateRangeUsecase } from '../../../interactors/usecases/shift/FindShiftsByDateRangeUsecase';
import { FindShiftsFromDayUsecase } from '../../../interactors/usecases/shift/FindShiftsFromDayUsecase';
import { CreateShiftRequest, CreateShiftResponse } from '../dto/CreateShift';
import {
  FindShiftByDateRangeResponse,
  FindShiftByDateResponse,
} from '../dto/FindShifts';
import { toPresentationError } from '../errors/errors';

@Controller('shifts')
export class ShiftsControllers {
  constructor(
    private readonly attachWorkerToShiftUsecase: AttachWorkerToShiftUsecase,
    private readonly findShiftsFromDayUsecase: FindShiftsFromDayUsecase,
    private readonly findShiftsByDateRangeUsecase: FindShiftsByDateRangeUsecase,
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
  @Get()
  async getShifts(
    @Query('date') date: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<FindShiftByDateResponse | FindShiftByDateRangeResponse> {
    if (date) {
      const result = await this.findShiftsFromDayUsecase.execute(
        new Date(date),
      );

      if (result.isLeft()) throw toPresentationError(result.value);

      return {
        date: result.value.date,
        shifts: result.value.shifts.map((shift) => ({
          id: shift.id,
          shiftSlot: shift.shiftSlot,
          workDay: shift.workDay,
          createdAt: shift.createdAt,
          updatedAt: shift.updatedAt,
          worker: shift.worker,
        })),
      };
    } else if (startDate && endDate) {
      const result = await this.findShiftsByDateRangeUsecase.execute(
        new Date(startDate),
        new Date(endDate),
      );

      if (result.isLeft()) throw toPresentationError(result.value);

      const mappedResult = result.value.map((workDay) => {
        return {
          date: workDay.date,
          shifts: workDay.shifts.map((shift) => ({
            id: shift.id,
            shiftSlot: shift.shiftSlot,
            workDay: shift.workDay,
            createdAt: shift.createdAt,
            updatedAt: shift.updatedAt,
            worker: shift.worker,
          })),
        };
      });

      return {
        workDays: mappedResult,
      };
    }
  }
}
