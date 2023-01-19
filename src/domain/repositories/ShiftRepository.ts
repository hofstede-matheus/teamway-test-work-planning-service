import {
  ShiftSlot,
  ShiftEntity,
  WorkDayEntity,
} from '../entities/Shift.entity';
import { WorkerEntity } from '../entities/Worker.entity';

export interface ShiftRepository {
  create(
    shiftSlot: ShiftSlot,
    workDay: Date,
    worker: WorkerEntity,
  ): Promise<ShiftEntity>;
  findByWorkDay(workDay: Date): Promise<WorkDayEntity>;
  findByWorkDays(startDay: Date, endDay: Date): Promise<WorkDayEntity[]>;
  remove(id: string): Promise<void>;
}

export const ShiftRepository = Symbol('ShiftRepository');
