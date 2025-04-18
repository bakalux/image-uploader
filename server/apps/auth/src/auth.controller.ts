import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SignIn')
  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {
    const token = await this.authService.signIn(data.email, data.password);

    return { token };
  }

  @GrpcMethod('AuthService', 'SignUp')
  signUp(data: SignUpRequestDto) {
    return this.authService.signUp(data.email, data.password);
  }

  @GrpcMethod('AuthService', 'verifyToken')
  verify(data: { token: string }) {
    return this.authService.verifyToken(data);
  }
}
