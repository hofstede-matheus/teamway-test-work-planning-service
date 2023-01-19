import { INestApplication } from '@nestjs/common';
import { connectionSource } from '../../ormconfig-test';
import { generateTestingApp, VALID_WORKER } from '../helpers';
import * as request from 'supertest';
import { CreateWorkerRequest } from '../../src/presentation/http/dto/CreateWorker';
import mongoose from 'mongoose';

describe('workers', () => {
  let app: INestApplication;

  beforeAll(async () => {
    mongoose.connect(
      'mongodb://teamway-test-work-planning-service:teamway-test-work-planning-service@localhost:27017/?authMechanism=DEFAULT',
      {
        dbName: 'teamway-test-work-planning-service-test',
      },
    );
    connectionSource.initialize();

    app = await generateTestingApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await connectionSource.destroy();
  });

  afterEach(async () => {
    await mongoose.connection.db.collection('workers').deleteMany({});
    await connectionSource.query(`DELETE FROM workers`);
  });

  it('shoud be able to create a worker', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    expect(bodyOfCreateWorkerRequest.id).toBeDefined();
    expect(bodyOfCreateWorkerRequest.name).toBe(VALID_WORKER.name);
  });

  it('shoud be able to find a worker by id', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetWorkerRequest } = await request(app.getHttpServer())
      .get(`/v1/workers/${bodyOfCreateWorkerRequest.id}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetWorkerRequest.id).toBe(bodyOfCreateWorkerRequest.id);
    expect(bodyOfGetWorkerRequest.name).toBe(VALID_WORKER.name);
    expect(bodyOfGetWorkerRequest.createdAt).toBeDefined();
    expect(bodyOfGetWorkerRequest.updatedAt).toBeDefined();
  });

  it('shoud be able to find all workers', async () => {
    const { body: bodyOfCreateWorkerRequest1 } = await request(
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
        name: VALID_WORKER.name + '_2',
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetWorkerRequest } = await request(app.getHttpServer())
      .get(`/v1/workers`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetWorkerRequest[0].id).toBe(bodyOfCreateWorkerRequest1.id);
    expect(bodyOfGetWorkerRequest[0].name).toBe(VALID_WORKER.name);
    expect(bodyOfGetWorkerRequest[0].createdAt).toBeDefined();
    expect(bodyOfGetWorkerRequest[0].updatedAt).toBeDefined();

    expect(bodyOfGetWorkerRequest[1].id).toBe(bodyOfCreateWorkerRequest2.id);
    expect(bodyOfGetWorkerRequest[1].name).toBe(VALID_WORKER.name + '_2');
    expect(bodyOfGetWorkerRequest[1].createdAt).toBeDefined();
    expect(bodyOfGetWorkerRequest[1].updatedAt).toBeDefined();
  });

  it('shoud be able to find workers by name', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfGetWorkerRequest } = await request(app.getHttpServer())
      .get(`/v1/workers?name=${VALID_WORKER.name}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetWorkerRequest[0].id).toBe(bodyOfCreateWorkerRequest.id);
    expect(bodyOfGetWorkerRequest[0].name).toBe(VALID_WORKER.name);
    expect(bodyOfGetWorkerRequest[0].createdAt).toBeDefined();
    expect(bodyOfGetWorkerRequest[0].updatedAt).toBeDefined();
  });

  it('shoud be able to update a worker', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/v1/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    const { body: bodyOfUpdateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .patch(`/v1/workers/${bodyOfCreateWorkerRequest.id}`)
      .send({
        name: VALID_WORKER.name + '_2',
      } as CreateWorkerRequest)
      .set('Accept', 'application/json');
    // .expect(200);

    expect(bodyOfUpdateWorkerRequest.id).toBe(bodyOfCreateWorkerRequest.id);
    expect(bodyOfUpdateWorkerRequest.name).toBe(VALID_WORKER.name + '_2');
    expect(bodyOfUpdateWorkerRequest.createdAt).toBeDefined();
    expect(bodyOfUpdateWorkerRequest.updatedAt).toBeDefined();

    const { body: bodyOfGetWorkerRequest } = await request(app.getHttpServer())
      .get(`/v1/workers/${bodyOfCreateWorkerRequest.id}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(bodyOfGetWorkerRequest.id).toBe(bodyOfCreateWorkerRequest.id);
    expect(bodyOfGetWorkerRequest.name).toBe(VALID_WORKER.name + '_2');
    expect(bodyOfGetWorkerRequest.createdAt).toBeDefined();
    expect(bodyOfGetWorkerRequest.updatedAt).toBeDefined();
  });

  it('shoud be able to remove a worker', async () => {
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
      .delete(`/v1/workers/${bodyOfCreateWorkerRequest.id}`)
      .set('Accept', 'application/json')
      .expect(200);

    await request(app.getHttpServer())
      .get(`/v1/workers/${bodyOfCreateWorkerRequest.id}`)
      .set('Accept', 'application/json')
      .expect(404);
  });
});
