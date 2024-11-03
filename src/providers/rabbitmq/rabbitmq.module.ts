import { Module } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import { env } from "../../configs/env";
import { ClientsModule } from "@nestjs/microservices";
import { RabbitmqConsumer } from "../../providers/rabbitmq/rabbitmq.consumer";

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: "rabbitmq_uai_food",
          useFactory: () => ({
            transport: Transport.RMQ,
            options: {
              urls: [env.RABBITMQ_URL],
              queue: env.RABBITMQ_RECEIVE,
              queueOptions: {
                durable: true,
              },
            },
          }),
        },
      ],
    }),
  ],
  providers: [RabbitmqConsumer],
  exports: [RabbitmqConsumer],
})
export class RabbitmqModule {}
