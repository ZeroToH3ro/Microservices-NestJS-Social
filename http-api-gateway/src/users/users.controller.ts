import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { lastValueFrom } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('users') // Groups endpoints under 'users' tag in Swagger UI
@Controller('users')
export class UsersController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.natsClient.send({ cmd: 'createUser' }, createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      'User found.' /* type: UserResponseType (define this if you have one) */,
  })
  @ApiResponse({ status: 404, description: 'User Not Found.' })
  async getUserById(@Param('id') id: string): Promise<unknown> {
    const user = await lastValueFrom(
      this.natsClient.send<unknown>({ cmd: 'getUserById' }, { userId: id }),
    );
    if (user) return user;
    else throw new HttpException('User Not Found', 404);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of users with pagination and search' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for user name or email',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users.',
  })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ): Promise<any> {
    return lastValueFrom(
      this.natsClient.send({ cmd: 'getUsers' }, { page, limit, search }),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to update',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User Not Found.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<any> {
    return lastValueFrom(
      this.natsClient.send(
        { cmd: 'updateUser' },
        {
          userId: id,
          updateData,
        },
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user to delete',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User Not Found.' })
  async deleteUser(@Param('id') id: string): Promise<any> {
    return lastValueFrom(
      this.natsClient.send({ cmd: 'deleteUser' }, { userId: id }),
    );
  }
}
