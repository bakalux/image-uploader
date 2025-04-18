import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IAuthServiceClient } from './iauth-service-client';

@Controller('auth')
export class AuthController {
  private authService: IAuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<IAuthServiceClient>('AuthService');
  }

  @Get('/me')
  me(@Req() req: Request): Observable<any> {
    const token = req.headers.authorization || 'fake-token';

    return this.authService.GetMe({ token });
  }

  @Post('/signup')
  signUp(
    @Req() req: Request<any, any, { email: string; password: string }>,
  ): Observable<any> {
    return this.authService.SignUp({
      email: req.body.email,
      password: req.body.password,
    });
  }

  @Post('/signin')
  signIn(
    @Req() req: Request<any, any, { email: string; password: string }>,
  ): Observable<any> {
    return this.authService.SignIn({
      email: req.body.email,
      password: req.body.password,
    });
  }
}
