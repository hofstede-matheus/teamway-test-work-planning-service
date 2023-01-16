import { INestApplication } from '@nestjs/common';
import { connectionSource } from '../../ormconfig-test';

describe('workers', () => {
  let app: INestApplication;

  connectionSource.initialize();

  beforeAll(async () => {
    app = await generateTestingApp();
    await app.init();
  });
});
