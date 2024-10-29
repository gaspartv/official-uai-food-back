import * as twilio from "twilio";
import { env } from "../../configs/env";
import TwilioSDK from "twilio";
import { ConflictException } from "@nestjs/common";

export class TwilioService {
  client: TwilioSDK.Twilio;

  constructor() {
    this.client = twilio.default(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  async sendSMS(to: string, body: string) {
    return await this.client.messages.create({
      to,
      from: env.TWILIO_PHONE_NUMBER,
      body,
    });
  }
}
