import { ConflictException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Security } from "../../../utils/security.util";
import { PrismaService } from "../../../providers/prisma/prisma.service";

export class AlreadyExistsDto {
  emails: { email: string }[];
  phones: { number: string }[];
  username: string;
  businessId: string;
  nationalId: string;
  id?: string;
}

export class UsersAlreadyExists {
  static async execute(
    prisma: PrismaService,
    dto: AlreadyExistsDto,
  ): Promise<void> {
    const { id, businessId } = dto;
    const emails = dto.emails.map((email) => Security.hash(email.email));
    const phones = dto.phones.map((phone) => Security.hash(phone.number));
    const username = Security.hash(dto.username);
    const nationalId = Security.hash(dto.nationalId);

    const where: Prisma.UserWhereInput = {};
    where.businessId = businessId;

    where.OR = [
      id
        ? { id: { not: id }, Emails: { some: { email: { in: emails } } } }
        : { Emails: { some: { email: { in: emails } } } },
      id
        ? {
            id: { not: id },
            Telephones: { some: { telephone: { in: phones } } },
          }
        : { Telephones: { some: { telephone: { in: phones } } } },
      id ? { id: { not: id }, username } : { username },
      id ? { id: { not: id }, nationalId } : { nationalId },
    ];

    const userFound = await prisma.user.findFirst({
      where,
      include: { Emails: true, Telephones: true },
    });

    if (userFound) {
      if (id && userFound.id === id) return;

      if (userFound.username === username) {
        throw new ConflictException(`Username ${dto.username} já cadastrado!`);
      }

      if (userFound.nationalId === nationalId) {
        throw new ConflictException(`CPF ${dto.nationalId} já cadastrado!`);
      }

      const emailAlreadyExists = userFound.Emails.find((emailObject) => {
        return emails.find((email) => email === emailObject.email);
      });
      if (emailAlreadyExists) {
        throw new ConflictException(
          `Email ${emailAlreadyExists.email} já cadastrado!`,
        );
      }

      const phoneAlreadyExists = userFound.Telephones.find((phoneObject) => {
        return phones.find((phone) => phone === phoneObject.telephone);
      });
      if (phoneAlreadyExists) {
        throw new ConflictException(
          `Telefone ${phoneAlreadyExists.telephone} já cadastrado!`,
        );
      }

      throw new ConflictException(`Usuário já existe!`);
    }
  }
}
