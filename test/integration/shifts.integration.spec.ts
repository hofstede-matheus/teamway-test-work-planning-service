import { INestApplication } from '@nestjs/common';
import { connectionSource } from '../../ormconfig-test';
import {
  END_DATE,
  generateTestingApp,
  START_DATE,
  VALID_WORKER,
} from '../helpers';
import * as request from 'supertest';
import { CreateWorkerRequest } from '../../src/presentation/http/dto/CreateWorker';
import { CreateShiftRequest } from '../../src/presentation/http/dto/CreateShift';

describe('shifts', () => {
  let app: INestApplication;

  connectionSource.initialize();

  beforeAll(async () => {
    app = await generateTestingApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await connectionSource.destroy();
  });

  afterEach(async () => {
    await connectionSource.query(`DELETE FROM workers`);
    await connectionSource.query(`DELETE FROM shifts`);
  });

  it('shoud be able to attach a worker to a shift', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateShiftRequest } = await request(
      app.getHttpServer(),
    )
      .post('/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    expect(bodyOfCreateShiftRequest.id).toBeDefined();
    expect(bodyOfCreateShiftRequest.workDay).toBe(
      new Date(2023, 1, 17).toISOString(),
    );
    expect(bodyOfCreateShiftRequest.shiftSlot).toBe('FIRST');
    expect(bodyOfCreateShiftRequest.createdAt).toBeDefined();
    expect(bodyOfCreateShiftRequest.updatedAt).toBeDefined();
  }, 10000);
});
