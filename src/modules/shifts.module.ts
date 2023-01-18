import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '../data/typeorm/entities/Shift';
import { TypeOrmShiftsRepository } from '../data/typeorm/repositories/TypeOrmShiftsRepository';
import { ShiftRepository } from '../domain/repositories/ShiftRepository';
import { AttachWorkerToShiftUsecase } from '../interactors/usecases/shift/AttachWorkerToShiftUsecase';
import { FindShiftsFromDayUsecase } from '../interactors/usecases/shift/FindShiftsFromDayUsecase';
import { ShiftsControllers } from '../presentation/http/controllers/ShiftsControllers';
import { WorkersModule } from './workers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shift]), WorkersModule],
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
  ],
  exports: [ShiftRepository],
})
export class ShiftsModule {}
