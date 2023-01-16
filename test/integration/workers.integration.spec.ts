import { INestApplication } from '@nestjs/common';
import { connectionSource } from '../../ormconfig-test';
import { generateTestingApp, VALID_WORKER } from '../helpers';
import * as request from 'supertest';
import { CreateWorkerRequest } from '../../src/presentation/http/dto/CreateWorker';

describe('workers', () => {
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
    // await connectionSource.query(`DELETE FROM workers`);
  });

  it('shoud be able to create a worker', async () => {
    const { body: bodyOfCreateWorkerRequest } = await request(
      app.getHttpServer(),
    )
      .post('/workers')
      .send({
        name: VALID_WORKER.name,
      } as CreateWorkerRequest)
      .set('Accept', 'application/json')
      .expect(201);

    expect(bodyOfCreateWorkerRequest.id).toBeDefined();
    expect(bodyOfCreateWorkerRequest.name).toBe(VALID_WORKER.name);
  });
});
