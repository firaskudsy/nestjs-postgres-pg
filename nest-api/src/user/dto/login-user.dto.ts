import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty()
  public email: string;

  @ApiProperty()
  public password: string;
}
