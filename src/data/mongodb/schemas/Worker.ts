import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WorkerDocument = Worker & Document;

@Schema({ timestamps: true })
export class Worker {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
