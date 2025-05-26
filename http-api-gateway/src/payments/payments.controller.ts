import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto } from './dtos/create-payments.dto';
import { lastValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetAllPaymentsQueryDto } from './dtos/get-all-payments-query.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Request to create a new payment' })
  @ApiResponse({
    status: 202,
    description: 'Payment creation request accepted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  requestCreatePayment(@Body() createPaymentDto: CreatePaymentDto) {
    this.natsClient.emit('createPayment', createPaymentDto);
    return { message: 'Payment creation request accepted.' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment found.',
  })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  async getPaymentById(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payment = await lastValueFrom(
        this.natsClient.send({ cmd: 'getPaymentById' }, { paymentId: id }),
      );

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return payment;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Error fetching payment by ID:', error);
      throw new HttpException(
        'Error fetching payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of all payments with optional filters and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payments.',
  })
  async getAllPayments(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: GetAllPaymentsQueryDto,
  ): Promise<any> {
    try {
      return await lastValueFrom(
        this.natsClient.send({ cmd: 'getAllPayments' }, query),
      );
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw new HttpException(
        'Error fetching payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
