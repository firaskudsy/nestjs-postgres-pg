import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Options,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthenticationGuard } from 'src/auth/guards/localAuthentication.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { UserService } from './user.service';
import JwtRefreshGuard from 'src/auth/guards/jwt-refresh.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('auth/register')
  @ApiOperation({ summary: 'Rgister new user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'login user with email and password' })
  @ApiResponse({
    status: 200,
    description: 'user successfully logged in',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;
    const user = await this.userService.find(email);
    const hashedPass = await this.userService.getHash(password);
    const valid = hashedPass === user.password;

    if (!valid) {
      return {
        accessToken: null,
        refreshToken: null,
        email,
      };
    }
    const accessToken = await this.authService.getJwtAccessToken(user);
    // const refresh_token = await this.authService.getJwtRefreshToken(user);

    const refreshToken = await this.authService.getJwtRefreshToken(user.email);

    await this.userService.setCurrentRefreshToken(refreshToken, user.email);

    // req.res.setHeader('Set-Cookie', [access_token.cookie, refreshTokenCookie]);

    // req.res.setHeader('Set-Cookie', access_token.cookie);

    const response = {
      accessToken,
      refreshToken,
      email,
    };
    return response;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('auth/refresh')
  async refresh(@Request() req) {
    const user = req.user;
    const accessToken = await this.authService.getJwtAccessToken(user);
    const refreshToken = await this.authService.getJwtRefreshToken(user.email);
    // req.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    const { email } = user;
    const response = {
      accessToken,
      refreshToken,
      email: user.email,
    };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.body;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('auth/logout')
  @HttpCode(200)
  async logOut(@Request() req) {
    await this.userService.removeRefreshToken(req.user.email);
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}
