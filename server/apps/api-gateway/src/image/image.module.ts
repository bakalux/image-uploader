import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IMAGE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'image',
          protoPath: join(process.cwd(), 'proto/image.proto'),
          url: 'image:50053',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), 'proto/auth.proto'),
          url: 'auth:50052',
        },
      },
    ]),
  ],
  providers: [AuthGuard],
  controllers: [ImageController],
})
export class ImageModule {}
