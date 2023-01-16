import { WorkerEntity } from '../entities/Worker.entity';

export interface WorkerRepository {
  create(name: string): Promise<WorkerEntity>;
  findByName(name: string): Promise<WorkerEntity[]>;
  findById(id: string): Promise<WorkerEntity | undefined>;
  findAll(): Promise<WorkerEntity[]>;
}

export const WorkerRepository = Symbol('WorkerRepository');
