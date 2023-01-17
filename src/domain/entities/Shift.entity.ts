import * as Joi from 'joi';
import { Either, left, right } from '../../shared/helpers/either';
import { DomainEntity, staticImplements } from '../../shared/helpers/entity';
import { DomainError } from '../../shared/helpers/errors';
import { InvalidShiftSlotError } from '../errors/domain-errors';
import { WorkerEntity } from './Worker.entity';

const MAXIMUM_SHIFTS_WORKER_CAN_HAVE_ON_A_DAY = 1;

export enum ShiftSlot {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
}

export interface WorkDay {
  readonly date: Date;
  readonly shifts: {
    readonly first: ShiftEntity;
    readonly second: ShiftEntity;
    readonly third: ShiftEntity;
  };
}

export interface ShiftEntity {
  readonly id: string;

  readonly workDay: Date;
  readonly shiftSlot: ShiftSlot;
  readonly worker: WorkerEntity;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

@staticImplements<DomainEntity<ShiftEntity>>()
export class ShiftEntity {
  private constructor(readonly shiftSlot: ShiftSlot, readonly workDay: Date) {}

  public static build(
    start: Date,
    end: Date,
  ): Either<DomainError, ShiftEntity> {
    const shiftSlot = this.getShiftSlot(start, end);
    const workDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );

    const schema = Joi.object({
      shiftSlot: Joi.string()
        .required()
        .valid(ShiftSlot.FIRST, ShiftSlot.SECOND, ShiftSlot.THIRD)
        .error(() => new InvalidShiftSlotError()),
    });

    const validation = schema.validate({
      shiftSlot,
    });
    if (validation.error) return left(validation.error);

    return right(new ShiftEntity(shiftSlot, workDay));
  }

  public static checkIfShiftSlotIsAvailableForWorker(
    worker: WorkerEntity,
    workDay: WorkDay,
  ) {
    const shifts = [
      workDay.shifts.first,
      workDay.shifts.second,
      workDay.shifts.third,
    ];

    const workerShifts = shifts.filter(
      (shift) => shift.worker.id === worker.id,
    );

    if (workerShifts.length >= MAXIMUM_SHIFTS_WORKER_CAN_HAVE_ON_A_DAY)
      return false;

    return true;
  }

  public static getShiftSlot(start: Date, end: Date): ShiftSlot {
    const startHour = start.getHours();
    const endHour = end.getHours();

    if (startHour === 0 && endHour === 8) return ShiftSlot.FIRST;
    if (startHour === 8 && endHour === 16) return ShiftSlot.SECOND;
    if (startHour === 16 && endHour === 24) return ShiftSlot.THIRD;
  }

  public static getDateFromShiftSlot(shiftSlot: ShiftSlot): {
    start: Date;
    end: Date;
  } {
    switch (shiftSlot) {
      case ShiftSlot.FIRST:
        return {
          start: new Date(0, 0, 0, 0, 0, 0, 0),
          end: new Date(0, 0, 0, 8, 0, 0, 0),
        };
      case ShiftSlot.SECOND:
        return {
          start: new Date(0, 0, 0, 8, 0, 0, 0),
          end: new Date(0, 0, 0, 16, 0, 0, 0),
        };
      case ShiftSlot.THIRD:
        return {
          start: new Date(0, 0, 0, 16, 0, 0, 0),
          end: new Date(0, 0, 0, 24, 0, 0, 0),
        };
    }
  }
}
