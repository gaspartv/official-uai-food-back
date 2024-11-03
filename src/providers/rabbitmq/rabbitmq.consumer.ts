import { Injectable } from "@nestjs/common";
import {
  Ctx,
  MessagePattern,
  RmqContext,
  Payload,
} from "@nestjs/microservices";

@Injectable()
export class RabbitmqConsumer {
  private ack(context: RmqContext): void {
    context.getChannelRef().ack(context.getMessage());
  }

  @MessagePattern("test")
  async test(@Ctx() context: RmqContext, @Payload() payload): Promise<void> {
    console.log("consumer 17", payload);
    this.ack(context);
  }
}
