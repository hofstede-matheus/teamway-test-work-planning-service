import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { connectionSource } from '../../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING, {
    dbName: process.env.MONGODB_DATABASE_NAME,
  }),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
