import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed
  app.enableCors();

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // Swagger (OpenAPI) Setup
  const config = new DocumentBuilder()
    .setTitle('Social Payment API Gateway')
    .setDescription(
      'API documentation for the Social Payment Microservice Gateway',
    )
    .setVersion('1.0')
    .addTag('users', 'User management operations')
    .addTag('payments', 'Payment processing operations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`HTTP API Gateway is running on: http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
}

bootstrap();
