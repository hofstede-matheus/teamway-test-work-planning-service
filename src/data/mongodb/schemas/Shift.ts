import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ShiftSlot } from '../../../domain/entities/Shift.entity';
import { WorkerMongoEntity } from './Worker';

export type WorkDayDocument = WorkDayMongoEntity & Document;

@Schema({ timestamps: true, _id: true })
export class ShiftMongoEntity {
  _id?: string;

  @Prop()
  shiftSlot: ShiftSlot;

  @Prop()
  worker: WorkerMongoEntity;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(ShiftMongoEntity);
@Schema({ timestamps: true })
export class WorkDayMongoEntity {
  @Prop()
  workDay: Date;

  @Prop({ type: [ShiftSchema], default: [] })
  shifts: ShiftMongoEntity[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const WorkDaySchema = SchemaFactory.createForClass(WorkDayMongoEntity);
