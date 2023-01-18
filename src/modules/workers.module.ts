import { Module } from '@nestjs/common';
import { TypeOrmWorkersRepository } from '../data/typeorm/repositories/TypeOrmWorkersRepository';
import { WorkerRepository } from '../domain/repositories/WorkerRepository';
import { CreateWorkerUsecase } from '../interactors/usecases/worker/CreateWorkerUsecase';
import { FindWorkersUsecase } from '../interactors/usecases/worker/FindWorkersUsecase';
import { RemoveWorkerUsecase } from '../interactors/usecases/worker/RemoveWorkerUsecase';
import { UpdateWorkerUsecase } from '../interactors/usecases/worker/UpdateWorkerUsecase';
import { WorkersController } from '../presentation/http/controllers/v1/WorkersControllers';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkersController],
  providers: [
    {
      provide: WorkerRepository,
      useClass: TypeOrmWorkersRepository,
    },
    {
      provide: CreateWorkerUsecase,
      useClass: CreateWorkerUsecase,
    },
    {
      provide: FindWorkersUsecase,
      useClass: FindWorkersUsecase,
    },
    {
      provide: UpdateWorkerUsecase,
      useClass: UpdateWorkerUsecase,
    },
    {
      provide: RemoveWorkerUsecase,
      useClass: RemoveWorkerUsecase,
    },
  ],
  exports: [WorkerRepository],
})
export class WorkersModule {}
