import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { UserEmailsService } from "../../modules/user-emails/user-emails.service";
import { Throttle } from "@nestjs/throttler";
import { UserEmailsCreateDto } from "../../modules/user-emails/dtos/user-emails.create.dto";

@Controller("user-emails")
export class UserEmailsController {
  constructor(private readonly service: UserEmailsService) {}

  @Throttle({ default: { limit: 1, ttl: 20000 } })
  @Post("create")
  @HttpCode(201)
  createUserEmail(@Body() body: UserEmailsCreateDto) {
    return this.service.createUserEmails(body, "");
  }
}
