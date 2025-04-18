import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IsUserAlreadyExistConstraint } from './users.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsUserAlreadyExistConstraint],
  exports: [UsersService, IsUserAlreadyExistConstraint],
})
export class UsersModule {}
