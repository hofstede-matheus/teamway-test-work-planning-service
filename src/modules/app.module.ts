import { Module } from '@nestjs/common';
import { AppController } from '../presentation/http/controllers/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
