import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { env } from "../../configs/env";
import { LocalStrategy } from "../../modules/auth/auth.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../../modules/auth/auth.guard";
import { AuthController } from "../../modules/auth/auth.controller";
import { AuthService } from "../../modules/auth/auth.service";
import { UsersModule } from "../../modules/users/users.module";
import { RedisModule } from "../../providers/redis/redis.module";

@Module({
  imports: [
    UsersModule,
    RedisModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRES_ACCESS_IN_DAY },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class AuthModule {}
