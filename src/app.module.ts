import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { RabbitmqModule } from "./providers/rabbitmq/rabbitmq.module";
import { env } from "./configs/env";
import { Transport, ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RabbitmqModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: "teste",
          useFactory: () => ({
            transport: Transport.RMQ,
            options: {
              urls: [env.RABBITMQ_URL],
              queue: env.RABBITMQ_SEND,
              queueOptions: {
                durable: true,
              },
            },
          }),
        },
      ],
    }),
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
