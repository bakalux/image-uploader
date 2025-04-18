import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsUserAlreadyExist } from '../users/users.validator';

export class SignInRequestDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
  @IsString()
  password: string;
}

export class SignUpRequestDto {
  @IsUserAlreadyExist({
    message: 'Пользователь с таким email уже зарегистрирован',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  @MaxLength(32, { message: 'Пароль должен быть не более 32 символов' })
  password: string;
}

export interface SignInResponseDto {
  token: string;
}
