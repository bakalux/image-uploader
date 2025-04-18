import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { GrpcErrorInterceptor } from './interceptors/grpc-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalInterceptors(new GrpcErrorInterceptor());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(process.env.port ?? 3000);
}

bootstrap();
