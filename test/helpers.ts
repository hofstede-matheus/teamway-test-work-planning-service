import { Provider } from '@nestjs/common';
import { WorkerRepository } from '../src/domain/repositories/WorkerRepository';

export const VALID_WORKER = {
  id: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  name: 'John',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ALL_REPOSITORIES_PROVIDERS: Provider[] = [
  {
    provide: WorkerRepository,
    useValue: {
      create: jest.fn(),
    } as WorkerRepository,
  },
];
