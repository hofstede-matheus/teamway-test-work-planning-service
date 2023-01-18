import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../presentation/http/controllers/app.controller';
import { DatabaseModule } from './database.module';
import { ShiftsModule } from './shifts.module';
import { WorkersModule } from './workers.module';

@Module({
  imports: [
    WorkersModule,
    ShiftsModule,
    ConfigModule.forRoot(),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
