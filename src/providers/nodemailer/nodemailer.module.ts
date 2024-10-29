import { Module } from "@nestjs/common";
import { NodemailerService } from "../../providers/nodemailer/nodemailer.service";

@Module({
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
