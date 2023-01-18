import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: [__dirname + 'src/data/typeorm/migrations/*.{js,ts}'],
  entities: [__dirname + 'src/data/typeorm/entities/*.{js,ts}'],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
});
