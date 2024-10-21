import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../providers/prisma/prisma.service";
import { UsersEntity } from "./users.entity";
import { UsersResponseDto } from "./dtos/users.response.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async alreadyExists(
    email?: string,
    username?: string,
    id?: string,
  ): Promise<void> {
    if (!email && !username) {
      throw new ConflictException(
        "E-mail ou nome de usuário devem ser fornecidos",
      );
    }
    const where =
      email && username
        ? { OR: [{ email }, { username }] }
        : email
          ? { email }
          : { username };
    const userFound = await this.prisma.user.findFirst({ where });
    if (userFound) {
      if (id && userFound.id === id) return;

      throw new ConflictException(
        `Usuário com ${
          email === userFound.email ? "email" : "username"
        } ${email === userFound.email ? email : username} já existe!`,
      );
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
