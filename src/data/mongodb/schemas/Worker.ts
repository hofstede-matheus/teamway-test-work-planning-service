import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WorkerDocument = WorkerMongoEntity & Document;

@Schema({ timestamps: true, collection: 'workers' })
export class WorkerMongoEntity {
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

export const WorkerSchema = SchemaFactory.createForClass(WorkerMongoEntity);
