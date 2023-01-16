import { WorkerEntity } from '../entities/Worker.entnty';

export interface WorkerRepository {
  create(name: string): Promise<WorkerEntity>;
}

export const WorkerRepository = Symbol('WorkerRepository');
