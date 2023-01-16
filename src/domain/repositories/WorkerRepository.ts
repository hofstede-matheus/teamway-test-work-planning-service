import { WorkerEntity } from '../entities/Worker.entity';

export interface WorkerRepository {
  create(name: string): Promise<WorkerEntity>;
}

export const WorkerRepository = Symbol('WorkerRepository');
