import { WorkerEntity } from '../entities/Worker.entity';

export interface WorkerRepository {
  create(name: string): Promise<WorkerEntity>;
  findByName(name: string): Promise<WorkerEntity[]>;
  findById(id: string): Promise<WorkerEntity | undefined>;
  findAll(): Promise<WorkerEntity[]>;
  update(worker: Partial<WorkerEntity>): Promise<WorkerEntity>;
  remove(id: string): Promise<void>;
}

export const WorkerRepository = Symbol('WorkerRepository');
