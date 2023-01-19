import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoDBShiftsRepository } from '../data/mongodb/repositories/MongoDBShiftsRepository';
import { WorkDay, WorkDaySchema } from '../data/mongodb/schemas/Shift';
import { TypeOrmShiftsRepository } from '../data/typeorm/repositories/TypeOrmShiftsRepository';
import { ShiftRepository } from '../domain/repositories/ShiftRepository';
import { AttachWorkerToShiftUsecase } from '../interactors/usecases/shift/AttachWorkerToShiftUsecase';
import { FindShiftsByDateRangeUsecase } from '../interactors/usecases/shift/FindShiftsByDateRangeUsecase';
import { FindShiftsFromDayUsecase } from '../interactors/usecases/shift/FindShiftsFromDayUsecase';
import { RemoveShiftUsecase } from '../interactors/usecases/shift/RemoveShiftUsecase';
import { ShiftsControllers } from '../presentation/http/controllers/v1/ShiftsControllers';
import { WorkersModule } from './workers.module';

@Module({
  imports: [
    WorkersModule,
    // TypeOrmModule.forFeature([Shift]),
    MongooseModule.forFeature([{ name: WorkDay.name, schema: WorkDaySchema }]),
  ],
  controllers: [ShiftsControllers],
  providers: [
    {
      provide: ShiftRepository,
      useClass: MongoDBShiftsRepository,
    },
    {
      provide: AttachWorkerToShiftUsecase,
      useClass: AttachWorkerToShiftUsecase,
    },
    {
      provide: FindShiftsFromDayUsecase,
      useClass: FindShiftsFromDayUsecase,
    },
    {
      provide: FindShiftsByDateRangeUsecase,
      useClass: FindShiftsByDateRangeUsecase,
    },
    {
      provide: RemoveShiftUsecase,
      useClass: RemoveShiftUsecase,
    },
  ],
  exports: [ShiftRepository],
})
export class ShiftsModule {}
