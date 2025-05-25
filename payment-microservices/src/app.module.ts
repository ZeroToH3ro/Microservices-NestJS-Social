import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payments/payments.module';
import { NatsClientModule } from './nats-client/nats-client.module';
import { Payment } from './typeorm/entities/Payment';
import { User } from './typeorm/entities/User';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql_db',
      port: 3306,
      database: 'social_payment',
      entities: [User, Payment],
      synchronize: false,
      username: 'testuser',
      password: 'testuser123',
    }),
    PaymentsModule,
    NatsClientModule,
  ],
})
export class AppModule {}
