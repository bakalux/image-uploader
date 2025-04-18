import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [AuthModule, ImageModule],
})
export class ApiGatewayModule {}
