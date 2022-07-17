import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {
  CacheInterceptor,
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['config.dev.env'], isGlobal: true }),
    CacheModule.register({
      ttl: 25, // seconds
      max: 100, // maximum number of items in cache
    }),
    // ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UserModule,
  ],
  controllers: [UserController],
  providers: [
    ConfigService,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
