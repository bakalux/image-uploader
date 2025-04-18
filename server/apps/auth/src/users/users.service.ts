import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return null;
    }

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(email: string, password: string): Promise<User> {
    const passwordHash = await this._generatePasswordHash(password);
    const entity = this.userRepository.create({
      email,
      password: passwordHash,
    });
    return this.userRepository.save(entity);
  }

  async checkCredentials(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user = await this.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const arePasswordsEqual = await this._comparePasswords(
      password,
      user.password,
    );

    return arePasswordsEqual ? user.id : null;
  }

  private async _generatePasswordHash(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  private _comparePasswords(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
