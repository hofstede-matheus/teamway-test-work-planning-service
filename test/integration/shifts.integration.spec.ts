import { INestApplication } from '@nestjs/common';
import {
  clearDatabase,
  closeTestingApp,
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

  beforeAll(async () => {
    app = await generateTestingApp();
    await app.init();
  });

  afterAll(async () => {
    await closeTestingApp(app);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('shoud be able to attach a worker to a shift', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateShiftRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/shifts')
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
  });

  it('should NOT create shift when worker already has a shift on the day', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateShiftRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(400);

    expect(bodyOfCreateShiftRequest.error).toBe('ShiftAlreadyTakenError');
  });

  it('shoud be able to get shifts from a day', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetShiftsRequest } = await request(app.getHttpServer())
      .get(`/v1/shifts?date=${START_DATE.toISOString()}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetShiftsRequest.date).toBe(
      new Date(2023, 1, 17).toISOString(),
    );
    expect(bodyOfGetShiftsRequest.shifts[0].id).toBeDefined();
    expect(bodyOfGetShiftsRequest.shifts[0].workDay).toBe(
      new Date(2023, 1, 17).toISOString(),
    );
    expect(bodyOfGetShiftsRequest.shifts[0].shiftSlot).toBe('FIRST');
    expect(bodyOfGetShiftsRequest.shifts[0].worker.id).toBeDefined();

    expect(bodyOfGetShiftsRequest.shifts[0].createdAt).toBeDefined();
    expect(bodyOfGetShiftsRequest.shifts[0].updatedAt).toBeDefined();
  });

  it('shoud be able to get shifts from a day range', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateWorkerRequest2 } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest2.id,
        shiftStart: new Date(2023, 1, 17, 8, 0, 0, 0),
        shiftEnd: new Date(2023, 1, 17, 16, 0, 0, 0),
      } as CreateShiftRequest)
      .set('Accept', 'application/json');

    await request(app.getHttpServer())
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: new Date(2023, 1, 18, 0, 0, 0, 0),
        shiftEnd: new Date(2023, 1, 18, 8, 0, 0, 0),
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetShiftsRequest } = await request(app.getHttpServer())
      .get(
        `/v1/shifts?startDate=${START_DATE.toISOString()}&endDate=${new Date(
          2023,
          1,
          18,
          0,
          0,
          0,
          0,
        ).toISOString()}`,
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetShiftsRequest.workDays[0].date).toBe(
      new Date(2023, 1, 17).toISOString(),
    );
    expect(bodyOfGetShiftsRequest.workDays[0].shifts[0].id).toBeDefined();
    expect(bodyOfGetShiftsRequest.workDays[0].shifts[0].workDay).toBe(
      new Date(2023, 1, 17).toISOString(),
    );
    expect(bodyOfGetShiftsRequest.workDays[0].shifts[0].shiftSlot).toBe(
      'FIRST',
    );
    expect(
      bodyOfGetShiftsRequest.workDays[0].shifts[0].worker.id,
    ).toBeDefined();

    expect(
      bodyOfGetShiftsRequest.workDays[0].shifts[0].createdAt,
    ).toBeDefined();
    expect(
      bodyOfGetShiftsRequest.workDays[0].shifts[0].updatedAt,
    ).toBeDefined();
  });

  it('shoud be able to remove a shift', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateShiftRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetShiftsRequest } = await request(app.getHttpServer())
      .get(`/v1/shifts?date=${START_DATE.toISOString()}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetShiftsRequest.shifts.length).toBe(1);

    await request(app.getHttpServer())
      .delete(`/v1/shifts/${bodyOfCreateShiftRequest.id}`)
      .set('Accept', 'application/json')
      .expect(200);

    const { body: bodyOfGetShiftsRequest2 } = await request(app.getHttpServer())
      .get(`/v1/shifts?date=${START_DATE.toISOString()}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetShiftsRequest2.shifts.length).toBe(0);
  });

  it('shoud be able to remove a shift with other shifts on workday', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateWorkerRequest2 } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfCreateShiftRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest.id,
        shiftStart: START_DATE,
        shiftEnd: END_DATE,
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/shifts')
      .send({
        workerId: bodyOfCreateWorkerRequest2.id,
        shiftStart: new Date(2023, 1, 17, 8, 0, 0, 0),
        shiftEnd: new Date(2023, 1, 17, 16, 0, 0, 0),
      } as CreateShiftRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetShiftsRequest } = await request(app.getHttpServer())
      .get(`/v1/shifts?date=${START_DATE.toISOString()}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetShiftsRequest.shifts.length).toBe(2);

    await request(app.getHttpServer())
      .delete(`/v1/shifts/${bodyOfCreateShiftRequest.id}`)
      .set('Accept', 'application/json')
      .expect(200);

    const { body: bodyOfGetShiftsRequest2 } = await request(app.getHttpServer())
      .get(`/v1/shifts?date=${START_DATE.toISOString()}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetShiftsRequest2.shifts.length).toBe(1);
  });
});
