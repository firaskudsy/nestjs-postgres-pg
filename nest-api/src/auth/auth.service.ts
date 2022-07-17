import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from '../user/dto/register-user.dto';

export interface RegistrationStatus {
  success: boolean;
  message: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private saltRounds = 10;

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.find(email);

    if (user && (await this.compareHash(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }
    return null;
  }
  async register(userDto: RegisterUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.userService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }
  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getJwtAccessToken(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    return token;
  }

  async getJwtRefreshToken(user: any) {
    const payload = {
      email: user,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    return token;
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
