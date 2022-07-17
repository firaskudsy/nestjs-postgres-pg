import {
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';

export class UserDTO {
  @IsString()
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password: string;
  readonly created_on: string;
  readonly updated_on: string;
  currentHashedRefreshToken: string;
}
