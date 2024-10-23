import { Module } from "@nestjs/common";
import { UserEmailsController } from "../../modules/user-emails/user-emails.controller";
import { UserEmailsService } from "../../modules/user-emails/user-emails.service";

@Module({
  imports: [],
  controllers: [UserEmailsController],
  providers: [UserEmailsService, UserEmailsService],
  exports: [],
})
export class UserEmailsModule {}
