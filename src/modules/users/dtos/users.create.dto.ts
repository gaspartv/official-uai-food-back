import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  ValidateNested,
} from "class-validator";
import { Language, UserEmailType, UserTelephoneType } from "@prisma/client";
import { Type } from "class-transformer";

class EmailDto {
  @IsEnum(UserEmailType)
  type: UserEmailType;

  @IsString()
  email: string;
}

class TelephoneDto {
  @IsEnum(UserTelephoneType)
  type: UserTelephoneType;

  @IsString()
  number: string;
}

export class UsersCreateDto {
  @IsString()
  companyId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  username: string;

  @IsString()
  nationalId: string;

  @IsString()
  password: string;

  @IsString()
  birthDate?: string;

  @IsEnum(Language)
  language?: Language;

  @IsBoolean()
  darkMode?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  emails: EmailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TelephoneDto)
  telephones: TelephoneDto[];
}
