import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { connectionSource } from '../../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '../data/typeorm/entities/Shift';
import { Worker } from '../data/typeorm/entities/Worker';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseProviders: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async () => {
      return {};
    },
    dataSourceFactory: async () => {
      const dataSource = await connectionSource.initialize();
      return dataSource;
    },
  }),
  MongooseModule.forRoot(
    'mongodb://teamway-test-work-planning-service:teamway-test-work-planning-service@localhost:27017/?authMechanism=DEFAULT',
    {
      dbName: 'teamway-test-work-planning-service',
    },
  ),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
