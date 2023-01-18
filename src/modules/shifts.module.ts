import { Module } from '@nestjs/common';
import { TypeOrmShiftsRepository } from '../data/typeorm/repositories/TypeOrmShiftsRepository';
import { ShiftRepository } from '../domain/repositories/ShiftRepository';
import { AttachWorkerToShiftUsecase } from '../interactors/usecases/shift/AttachWorkerToShiftUsecase';
import { FindShiftsByDateRangeUsecase } from '../interactors/usecases/shift/FindShiftsByDateRangeUsecase';
import { FindShiftsFromDayUsecase } from '../interactors/usecases/shift/FindShiftsFromDayUsecase';
import { RemoveShiftUsecase } from '../interactors/usecases/shift/RemoveShiftUsecase';
import { ShiftsControllers } from '../presentation/http/controllers/v1/ShiftsControllers';
import { DatabaseModule } from './database.module';
import { WorkersModule } from './workers.module';

@Module({
  imports: [DatabaseModule, WorkersModule],
  controllers: [ShiftsControllers],
  providers: [
    {
      provide: ShiftRepository,
      useClass: TypeOrmShiftsRepository,
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
