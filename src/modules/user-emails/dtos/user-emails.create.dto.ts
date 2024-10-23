import { UserEmailType } from "@prisma/client";
import { IsEmail, IsEnum } from "class-validator";

export class UserEmailsCreateDto {
  @IsEnum(UserEmailType)
  type: UserEmailType;

  @IsEmail()
  email: string;
}
