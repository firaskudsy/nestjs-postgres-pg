import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  public email: string;

  @IsString()
  @ApiProperty()
  public first_name: string;

  @IsString()
  @ApiProperty()
  public last_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public password: string;
}
