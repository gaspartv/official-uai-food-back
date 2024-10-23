import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../providers/prisma/prisma.service";
import { UserEmailsEntity } from "../../modules/user-emails/user-emails.entity";
import { UserEmailsResponseDto } from "./dtos/user-emails.response.dto";

@Injectable()
export class UserEmailsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(Entity: UserEmailsEntity): Promise<UserEmailsResponseDto> {
    return this.prisma.userEmail.create({ data: Entity.response });
  }
}
