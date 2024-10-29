import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { PrismaModule } from "../../providers/prisma/prisma.module";
import { NodemailerModule } from "../../providers/nodemailer/nodemailer.module";
import { TwilioModule } from "../../providers/twilio/twilio.module";

@Module({
  imports: [PrismaModule, NodemailerModule, TwilioModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
