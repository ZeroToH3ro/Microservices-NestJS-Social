import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NatsClientModule } from './nats-client/nats-client.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [UsersModule, NatsClientModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
