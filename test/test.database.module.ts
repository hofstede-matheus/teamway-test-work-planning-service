import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from '../ormconfig-test';
import { Shift } from '../src/data/typeorm/entities/Shift';
import { Worker } from '../src/data/typeorm/entities/Worker';

const databaseProviders: Array<
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
  // TypeOrmModule.forFeature([Shift, Worker]),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class TestDatabaseModule {}
