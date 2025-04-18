import { NestFactory } from '@nestjs/core';
import { ImageAppModule } from './image-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ImageAppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50053',
        package: 'image',
        protoPath: join(process.cwd(), 'proto/image.proto'),
      },
    },
  );

  await app.listen();
  console.log('🚀 image gRPC сервер запущен на :50053');
}

bootstrap();
