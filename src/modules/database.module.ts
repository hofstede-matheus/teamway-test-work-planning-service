import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { connectionSource } from '../../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '../data/typeorm/entities/Shift';
import { Worker } from '../data/typeorm/entities/Worker';

const databaseProviders: Array<
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
  TypeOrmModule.forFeature([Shift, Worker]),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
