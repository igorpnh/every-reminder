import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ReminderModule } from './reminder/reminder.module';
import { UserController } from './user/user.controller';
import { ReminderController } from './reminder/reminder.controller';
import { UserService } from './user/user.service';
import { ReminderService } from './reminder/reminder.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { CompanyModule } from './company/company.module';
import { TaskModule } from './task/task.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ReminderModule,
    AuthModule,
    CompanyModule,
    TaskModule,
    LikesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
