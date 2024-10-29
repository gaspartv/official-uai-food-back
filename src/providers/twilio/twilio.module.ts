import { Module } from "@nestjs/common";
import { TwilioService } from "../../providers/twilio/twilio.service";

@Module({
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
