import { INestApplication, Provider, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { WorkerRepository } from '../src/domain/repositories/WorkerRepository';
import { ConfigModule } from '@nestjs/config';
import { WorkersModule } from '../src/modules/workers.module';
import { ShiftRepository } from '../src/domain/repositories/ShiftRepository';
import { ShiftEntity, ShiftSlot } from '../src/domain/entities/Shift.entity';
import { WorkerEntity } from '../src/domain/entities/Worker.entity';
import { ShiftsModule } from '../src/modules/shifts.module';
import { TestDatabaseModule } from './test.database.module';

export const VALID_WORKER: WorkerEntity = {
  id: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  name: 'John',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const VALID_SHIFT_FIRST_SLOT: ShiftEntity = {
  id: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  worker: VALID_WORKER,
  shiftSlot: ShiftSlot.FIRST,
  createdAt: new Date(),
  updatedAt: new Date(),
  workDay: new Date(),
};

export const VALID_SHIFT_SECOND_SLOT: ShiftEntity = {
  id: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  worker: VALID_WORKER,
  shiftSlot: ShiftSlot.SECOND,
  createdAt: new Date(),
  updatedAt: new Date(),
  workDay: new Date(),
};

export const START_DATE = new Date(2023, 1, 17, 0, 0, 0, 0);
export const END_DATE = new Date(2023, 1, 17, 8, 0, 0, 0);

export const ALL_REPOSITORIES_PROVIDERS: Provider[] = [
  {
    provide: WorkerRepository,
    useValue: {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as WorkerRepository,
  },
  {
    provide: ShiftRepository,
    useValue: {
      create: jest.fn(),
      findByWorkDay: jest.fn(),
      findByWorkDays: jest.fn(),
      remove: jest.fn(),
    } as ShiftRepository,
  },
];

export const ALL_MODULES = [WorkersModule, ShiftsModule, TestDatabaseModule];

export const TEST_CONFIG = [
  ConfigModule.forRoot({
    envFilePath: '.env.test',
  }),
  ...ALL_MODULES,
];

export async function generateTestingApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: TEST_CONFIG,
    providers: [],
  }).compile();

  const app = module.createNestApplication();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  return app;
}
