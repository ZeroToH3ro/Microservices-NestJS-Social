import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @MessagePattern({ cmd: 'createUser' })
  createUser(@Payload() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'getUserById' })
  getUserById(@Payload() data: { userId: string }) {
    const { userId } = data;
    return this.userService.getUserById(userId);
  }

  @MessagePattern({ cmd: 'getUsers' })
  getUsers(
    @Payload() data: { page?: number; limit?: number; search?: string },
  ) {
    const { page = 1, limit = 10, search } = data;
    return this.userService.getUsers(page, limit, search);
  }

  @MessagePattern({ cmd: 'updateUser' })
  updateUser(@Payload() data: { userId: string; updateData: UpdateUserDto }) {
    const { userId, updateData } = data;
    return this.userService.updateUser(userId, updateData);
  }

  @MessagePattern({ cmd: 'deleteUser' })
  deleteUser(@Payload() data: { userId: string }) {
    const { userId } = data;
    return this.userService.deleteUser(userId);
  }

  @EventPattern('paymentCreated')
  paymentCreated(@Payload() data: any) {
    console.log(data);
  }
}
