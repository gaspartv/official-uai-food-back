import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../providers/prisma/prisma.service";
import { UsersEntity } from "./users.entity";
import { UsersResponseDto } from "./dtos/users.response.dto";
import {
  AlreadyExistsDto,
  UsersAlreadyExists,
} from "../../modules/users/repositories/users.already-exists.repository";
import { UserEmailsEntity } from "../../modules/user-emails/user-emails.entity";
import { UserTelephonesEntity } from "../../modules/user-telephones/user-telephones.entity";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  alreadyExists(dto: AlreadyExistsDto): Promise<void> {
    return UsersAlreadyExists.execute(this.prisma, dto);
  }

  create(
    UserEntity: UsersEntity,
    EmailsEntities: UserEmailsEntity[],
    PhonesEntities: UserTelephonesEntity[],
  ): Promise<void> {
    return this.prisma.$transaction(async (t) => {
      await t.user.create({ data: UserEntity.response });
      await t.userEmail.createMany({
        data: EmailsEntities.map((entity) => entity.response),
      });
      await t.userTelephone.createMany({
        data: PhonesEntities.map((entity) => entity.response),
      });
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
