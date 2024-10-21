import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,

    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 10 }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
