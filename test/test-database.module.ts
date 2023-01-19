import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from '../ormconfig-test';
import { ShiftTypeOrmEntity } from '../src/data/typeorm/entities/Shift';
import { WorkerTypeOrmEntity } from '../src/data/typeorm/entities/Worker';

export const databaseProviders: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  TypeOrmModule.forRootAsync({
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.env.test',
      }),
    ],
    useFactory: async () => {
      return {};
    },
    dataSourceFactory: async () => {
      const dataSource = await connectionSource.initialize();
      return dataSource;
    },
  }),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class TestDatabaseModule {}
