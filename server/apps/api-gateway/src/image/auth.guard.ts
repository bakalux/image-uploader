import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IAuthServiceClient } from '../auth/iauth-service-client';
import { AuthRequest } from './types';
import { ServiceError, status } from '@grpc/grpc-js';

@Injectable()
export class AuthGuard implements CanActivate {
  private authService: IAuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<IAuthServiceClient>('AuthService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AuthRequest = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const user = await firstValueFrom(
        this.authService.VerifyToken({ token }),
      );
      req.userId = user.id;
      return true;
    } catch (err: unknown) {
      if (isServiceError(err) && err.code === status.UNAUTHENTICATED) {
        console.error('Invalid token', err);
        throw new UnauthorizedException('Invalid token');
      }
      throw new InternalServerErrorException(err);
    }
  }
}

function isServiceError(error: unknown): error is ServiceError {
  return Object.hasOwnProperty.call(error, 'code');
}
