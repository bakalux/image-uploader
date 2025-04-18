import { Injectable } from '@nestjs/common';
import { User } from './users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { JWT_SECRET } from './config';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

interface JWTPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signUp(email: string, password: string): Promise<User> {
    return this.userService.createUser(email, password);
  }

  async signIn(email: string, password: string): Promise<string> {
    const userId = await this.userService.checkCredentials(email, password);
    if (userId === null) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid credentials',
      });
    }

    const payload: JWTPayload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: JWT_SECRET,
    });
  }

  async verifyToken(data: { token: string }): Promise<Omit<User, 'password'>> {
    try {
      const result = await this.jwtService.verifyAsync<JWTPayload>(data.token, {
        secret: JWT_SECRET,
      });
      const user = await this.userService.getUserById(result.sub);

      if (user === null) {
        throw new Error('invalid token');
      }

      const { password, ...rest } = user;

      return { ...rest };
    } catch {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }
  }
}
