import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from '../data/typeorm/entities/Worker';
import { TypeOrmWorkersRepository } from '../data/typeorm/repositories/TypeOrmWorkersRepository';
import { WorkerRepository } from '../domain/repositories/WorkerRepository';
import { CreateWorkerUsecase } from '../interactors/usecases/CreateWorkerUsecase';
import { FindWorkersUsecase } from '../interactors/usecases/FindWorkersUsecase';
import { RemoveWorkerUsecase } from '../interactors/usecases/RemoveWorkerUsecase';
import { UpdateWorkerUsecase } from '../interactors/usecases/UpdateWorkerUsecase';
import { WorkersController } from '../presentation/http/controllers/WorkersControllers';

@Module({
  imports: [TypeOrmModule.forFeature([Worker])],
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
