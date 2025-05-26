import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/typeorm/entities/Payment'; // Ensure this path is correct
import { Repository, FindManyOptions } from 'typeorm';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(newPayment);
  }

  async getPaymentById(paymentId: string): Promise<Payment | null> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['user'],
    });
    if (!payment) {
      return null;
    }
    return payment;
  }

  async getAllPayments(options: {
    page?: number;
    limit?: number;
  }): Promise<{ data: Payment[]; meta: any }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Payment> = {
      take: limit,
      skip: skip,
      where: {},
    };

    // if (userId) {
    //   findOptions.where = { ...findOptions.where, userId};
    // }
    // if (status) {
    //   findOptions.where = { ...findOptions.where, status };
    // }

    const [data, totalCount] =
      await this.paymentsRepository.findAndCount(findOptions);

    return {
      data,
      meta: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
