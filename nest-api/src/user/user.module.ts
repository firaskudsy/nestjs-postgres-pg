import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
