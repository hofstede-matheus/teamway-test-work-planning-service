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
    // await this.shiftsRepository
    //   .query(`insert into "shifts" ("created_at", "id", "shift_slot", "updated_at", "work_day", "worker_id") values ('2023-01-17 21:14:21.729914', '741c151f-5a42-490d-b8aa-9e9858538a0b', 'FIRST', '2023-01-17 21:14:21.729914', '2023-02-17T03:00:00.000Z'::timestamp::date, '1314a722-321f-4668-9d92-90ca78e38707');
    // `);
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
  findByWorkDays(startDay: Date, endDay: Date): Promise<WorkDay[]> {
    throw new Error('Method not implemented.');
  }
}
