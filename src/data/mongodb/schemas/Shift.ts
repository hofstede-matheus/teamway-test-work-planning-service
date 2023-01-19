import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ShiftSlot } from '../../../domain/entities/Shift.entity';
import { Worker } from './Worker';

export type WorkDayDocument = WorkDay & Document;

const WorkDayShiftSchema = new mongoose.Schema(
  {
    workday: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    deletedAt: { type: Date, required: false },
    shifts: [
      new mongoose.Schema({
        shiftSlot: { type: String, required: true },
        worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
        deletedAt: { type: Date, required: false },
      }),
    ],
  },
  { timestamps: true },
);

@Schema({ timestamps: true, _id: true })
export class Shift {
  _id?: string;

  @Prop()
  shiftSlot: ShiftSlot;

  @Prop()
  worker: Worker;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
@Schema({ timestamps: true })
export class WorkDay {
  @Prop()
  workDay: Date;

  @Prop({ type: [ShiftSchema], default: [] })
  shifts: Shift[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const WorkDaySchema = SchemaFactory.createForClass(WorkDay);
