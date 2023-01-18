import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ShiftSlot,
  ShiftEntity,
  WorkDay,
} from '../../../domain/entities/Shift.entity';
import { WorkerEntity } from '../../../domain/entities/Worker.entity';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { Shift } from '../entities/Shift';

export class TypeOrmShiftsRepository implements ShiftRepository {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftsRepository: Repository<Shift>,
  ) {}

  remove(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(
    shiftSlot: ShiftSlot,
    workDay: Date,
    worker: WorkerEntity,
  ): Promise<ShiftEntity> {
    const shift = this.shiftsRepository.create({
      shiftSlot,
      workDay,
      workerId: worker.id,
    });

    const shiftInDatabase = await this.shiftsRepository.save(shift);

    return {
      id: shiftInDatabase.id,
      shiftSlot: shiftInDatabase.shiftSlot,
      workDay: shiftInDatabase.workDay,
      worker: {
        id: worker.id,
        name: worker.name,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt,
      },
      createdAt: shiftInDatabase.createdAt,
      updatedAt: shiftInDatabase.updatedAt,
    };
  }

  async findByWorkDay(workDay: Date): Promise<WorkDay> {
    const workDayInDatabase = await this.shiftsRepository.query(
      `
      SELECT 
        shifts.id, shifts.work_day, shifts.shift_slot, shifts.worker_id, shifts.created_at, shifts.updated_at, 
        workers.name as worker_name, workers.created_at as worker_created_at, workers.updated_at as worker_updated_at, workers.id as worker_id
      FROM shifts 
      INNER JOIN workers ON shifts.worker_id = workers.id
      WHERE shifts.work_day = $1::timestamp::date
    `,
      [workDay],
    );
    const mappedWorkDay: WorkDay = {
      date: workDay,
      shifts: workDayInDatabase.map(
        (shift) =>
          ({
            id: shift.id,
            workDay: shift.work_day,
            shiftSlot: shift.shift_slot,
            worker: {
              id: shift.worker_id,
              name: shift.worker_name,
              createdAt: shift.worker_created_at,
              updatedAt: shift.worker_updated_at,
            },
            createdAt: shift.created_at,
            updatedAt: shift.updated_at,
          } as ShiftEntity),
      ),
    };

    return mappedWorkDay;
  }
  async findByWorkDays(startDay: Date, endDay: Date): Promise<WorkDay[]> {
    const workDayInDatabase = await this.shiftsRepository.query(
      `
      SELECT 
        shifts.id, shifts.work_day, shifts.shift_slot, shifts.worker_id, shifts.created_at, shifts.updated_at, 
        workers.name as worker_name, workers.created_at as worker_created_at, workers.updated_at as worker_updated_at, workers.id as worker_id
      FROM shifts 
      INNER JOIN workers ON shifts.worker_id = workers.id
      WHERE shifts.work_day BETWEEN $1::timestamp::date AND $2::timestamp::date
    `,
      [startDay, endDay],
    );
    const workDays = workDayInDatabase.reduce((acc, shift) => {
      const day = shift.work_day.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = {
          date: shift.work_day,
          shifts: [],
        };
      }
      acc[day].shifts.push({
        id: shift.id,
        workDay: shift.work_day,
        shiftSlot: shift.shift_slot,
        worker: {
          id: shift.worker_id,
          name: shift.worker_name,
          createdAt: shift.worker_created_at,
          updatedAt: shift.worker_updated_at,
        },
        createdAt: shift.created_at,
        updatedAt: shift.updated_at,
      } as ShiftEntity);
      return acc;
    }, {} as { [key: string]: WorkDay });

    const workDaysArray: WorkDay[] = Object.values(workDays);
    const sortedWorkDays = workDaysArray.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    return sortedWorkDays;
  }
}
