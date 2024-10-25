import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../providers/prisma/prisma.service";
import { UsersEntity } from "./users.entity";
import { UsersResponseDto } from "./dtos/users.response.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async alreadyExists(
    emails?: string[],
    username?: string,
    id?: string,
  ): Promise<void> {
    if (!emails?.length && !username) {
      throw new ConflictException(
        "E-mail ou nome de usuário devem ser fornecidos",
      );
    }

    const where: Prisma.UserWhereInput = {};

    if (emails.length && username) {
      where.OR = [
        { Emails: { some: { email: { in: emails } } } },
        { username },
      ];
    } else if (emails.length) {
      where.Emails = { some: { email: { in: emails } } };
    } else {
      where.username = username;
    }

    const userFound = await this.prisma.user.findFirst({
      where,
      include: { Emails: true },
    });

    if (userFound) {
      if (id && userFound.id === id) return;
      const emailAlreadyExists = userFound.Emails.find((emailObject) => {
        emails.includes(emailObject.email);
      });

      const conflictDetail = emailAlreadyExists
        ? `email ${emailAlreadyExists.email}`
        : `username ${username}`;

      throw new ConflictException(`Usuário com ${conflictDetail} já existe!`);
    }
  }

  create(Entity: UsersEntity): Promise<UsersResponseDto> {
    return this.prisma.user.create({
      data: Entity.response,
    });
  }

  update(Entity: UsersEntity): Promise<UsersResponseDto> {
    return this.prisma.user.update({
      where: { id: Entity.id },
      data: Entity.response,
    });
  }

  findByUsername(username: string): Promise<UsersResponseDto> {
    const userFound = this.prisma.user.findFirst({ where: { username } });
    if (!userFound) throw new ConflictException("Usuário não encontrado!");
    return userFound;
  }

  findById(id: string): Promise<UsersResponseDto> {
    const userFound = this.prisma.user.findFirst({ where: { id } });
    if (!userFound) throw new ConflictException("Usuário não encontrado!");
    return userFound;
  }
}
