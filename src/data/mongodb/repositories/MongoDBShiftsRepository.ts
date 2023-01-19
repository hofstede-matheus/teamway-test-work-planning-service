import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ShiftSlot,
  ShiftEntity,
  WorkDayEntity,
} from '../../../domain/entities/Shift.entity';
import { WorkerEntity } from '../../../domain/entities/Worker.entity';
import { ShiftRepository } from '../../../domain/repositories/ShiftRepository';
import { WorkDayMongoEntity, WorkDayDocument } from '../schemas/Shift';

export class MongoDBShiftsRepository implements ShiftRepository {
  constructor(
    @InjectModel(WorkDayMongoEntity.name) private workDayModel: Model<WorkDayDocument>,
  ) {}

  async create(
    shiftSlot: ShiftSlot,
    workDay: Date,
    worker: WorkerEntity,
  ): Promise<ShiftEntity> {
    const workDayInDatabase = await this.workDayModel.findOne({
      workDay,
    });
    const dateNow = new Date();

    if (workDayInDatabase) {
      workDayInDatabase.shifts.push({
        shiftSlot,
        worker,
        createdAt: dateNow,
        updatedAt: dateNow,
      });
      const newWorkDay = await workDayInDatabase.save();

      const newShift = newWorkDay.shifts.find(
        (shift) => shift.shiftSlot === shiftSlot,
      );

      return {
        id: newShift._id.toString(),
        shiftSlot,
        workDay,
        worker: {
          id: worker.id,
          name: worker.name,
          createdAt: worker.createdAt,
          updatedAt: worker.updatedAt,
        },
        updatedAt: dateNow,
        createdAt: dateNow,
      };
    } else {
      const newWorkDay = new this.workDayModel({
        workDay,
        shifts: [
          {
            shiftSlot,
            worker,
            createdAt: dateNow,
            updatedAt: dateNow,
          },
        ],
      });

      const newShiftInDatabase = await newWorkDay.save();

      return {
        id: newShiftInDatabase.shifts[0]._id.toString(),
        shiftSlot,
        workDay,
        worker: {
          id: worker.id,
          name: worker.name,
          createdAt: worker.createdAt,
          updatedAt: worker.updatedAt,
        },
        updatedAt: dateNow,
        createdAt: dateNow,
      };
    }
  }

  async findByWorkDay(workDay: Date): Promise<WorkDayEntity> {
    const workdaysWithShifts = await this.workDayModel.findOne({
      workDay,
    });

    if (!workdaysWithShifts)
      return {
        date: workDay,
        shifts: [],
      };

    return {
      date: workDay,
      shifts: workdaysWithShifts.shifts.map((shift) => ({
        id: shift._id.toString(),
        workDay: workdaysWithShifts.workDay,
        shiftSlot: shift.shiftSlot,
        worker: {
          id: shift.worker.id,
          name: shift.worker.name,
          createdAt: shift.worker.createdAt,
          updatedAt: shift.worker.updatedAt,
        },
        createdAt: shift.createdAt,
        updatedAt: shift.updatedAt,
      })),
    };
  }

  async findByWorkDays(startDay: Date, endDay: Date): Promise<WorkDayEntity[]> {
    const workdaysWithShifts = await this.workDayModel.find({
      workDay: {
        $gte: startDay,
        $lte: endDay,
      },
    });
    const workDays: WorkDayEntity[] = [];

    for (const workdayWithShifts of workdaysWithShifts) {
      workDays.push({
        date: workdayWithShifts.workDay,
        shifts: workdayWithShifts.shifts.map((shift) => ({
          id: shift._id.toString(),
          workDay: workdayWithShifts.workDay,
          shiftSlot: shift.shiftSlot,
          worker: {
            id: shift.worker.id,
            name: shift.worker.name,
            createdAt: shift.worker.createdAt,
            updatedAt: shift.worker.updatedAt,
          },
          createdAt: shift.createdAt,
          updatedAt: shift.updatedAt,
        })),
      });
    }

    return workDays;
  }

  async remove(id: string): Promise<void> {
    const workDay = await this.workDayModel.findOne({
      shifts: {
        $elemMatch: {
          _id: new mongoose.Types.ObjectId(id),
        },
        // _id: new mongoose.Types.ObjectId(id),
      },
    });

    if (workDay.shifts.length === 1) {
      workDay.remove();
      return;
    }

    const newShifts = workDay.shifts.filter(
      (shift) => shift._id.toString() !== id,
    );

    workDay.shifts = newShifts;

    await workDay.save();
  }
}
