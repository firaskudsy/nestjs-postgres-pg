import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/shared/interfaces/user.interface';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';

import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userModel: Repository<User>;

  private saltRounds = 10;

  async create(body: RegisterUserDto): Promise<User> {
    const user: User = new User();
    const { email, first_name, last_name, password } = body;

    const userInDb = await this.userModel.findOne({
      where: { email },
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await this.getHash(password);
    user.email = email;
    user.first_name = first_name;
    user.last_name = last_name;
    user.password = passwordHash;
    user.currentHashedRefreshToken = '';

    return this.userModel.save(user);
  }

  async getById(id: number) {
    const user = await this.userModel.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async find(email: string): Promise<any | undefined> {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userModel.findOne({ where: { email } });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.update(
      { email },
      {
        currentHashedRefreshToken,
      },
    );
  }

  async removeRefreshToken(email: string) {
    return this.userModel.update(
      { email },
      {
        currentHashedRefreshToken: null,
      },
    );
  }
}
