import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AuthAppModule } from './auth-app.module';
import { ValidationPipe } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthAppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(process.cwd(), 'proto/auth.proto'),
        url: '0.0.0.0:50052',
      },
    },
  );

  useContainer(app.select(AuthAppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const errorMessages = errors
          .flatMap((error) => Object.values(error.constraints || {}))
          .join(', ');

        return new RpcException({
          code: status.INVALID_ARGUMENT,
          message: errorMessages,
          details: errors,
        });
      },
    }),
  );

  await app.listen();
}

bootstrap();
