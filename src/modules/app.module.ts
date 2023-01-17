import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '../data/typeorm/entities/Shift';
import { Worker } from '../data/typeorm/entities/Worker';
import { AppController } from '../presentation/http/controllers/app.controller';
import { ShiftsModule } from './shifts.module';
import { WorkersModule } from './workers.module';

@Module({
  imports: [
    WorkersModule,
    ShiftsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Worker, Shift],
      logging: process.env.DATABASE_LOGGING === 'true',
      migrations: ['dist/src/data/typeorm/migrations/*.js'],
      migrationsRun: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
