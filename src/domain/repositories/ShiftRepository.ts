import { ShiftSlot, ShiftEntity, WorkDay } from '../entities/Shift.entity';
import { WorkerEntity } from '../entities/Worker.entity';

export interface ShiftRepository {
  create(
    shiftSlot: ShiftSlot,
    workDay: Date,
    worker: WorkerEntity,
  ): Promise<ShiftEntity>;
  findByWorkDay(workDay: Date): Promise<WorkDay>;
  findByWorkDays(startDay: Date, endDay: Date): Promise<WorkDay[]>;
}

export const ShiftRepository = Symbol('ShiftRepository');
