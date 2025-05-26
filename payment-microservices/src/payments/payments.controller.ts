import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private paymentsService: PaymentsService,
  ) {}

  @EventPattern('createPayment')
  async handleCreatePayment(@Payload() createPaymentDto: CreatePaymentDto) {
    console.log('Received createPayment event:', createPaymentDto);
    const newPayment =
      await this.paymentsService.createPayment(createPaymentDto);
    if (newPayment) {
      this.natsClient.emit('paymentProcessed', newPayment);
      console.log('Emitted paymentProcessed event:', newPayment);
    }
  }

  @MessagePattern({ cmd: 'getPaymentById' })
  async getPaymentById(@Payload() data: { paymentId: string }) {
    const { paymentId } = data;
    return this.paymentsService.getPaymentById(paymentId);
  }

  @MessagePattern({ cmd: 'getAllPayments' })
  async getAllPayments(
    @Payload()
    data: {
      page?: number;
      limit?: number;
    },
  ) {
    return this.paymentsService.getAllPayments(data);
  }
}
