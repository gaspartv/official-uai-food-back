import { UsersCreateDto } from "./dtos/users.create.dto";
import { UsersRepository } from "./users.repository";
import { UsersEntity } from "./users.entity";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Security } from "../../utils/security.util";
import { env } from "../../configs/env";
import { Generate } from "../../utils/generate.utils";
import { RedisService } from "../../providers/redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import { UserEmailsEntity } from "../../modules/user-emails/user-emails.entity";
import { UserTelephonesEntity } from "../../modules/user-telephones/user-telephones.entity";
import { MessageDto } from "../../common/dtos/message.dto";
import { NodemailerService } from "../../providers/nodemailer/nodemailer.service";
import { resolve } from "path";
import { mainDirname } from "../../root-dirname";
import * as fs from "node:fs";
import * as handlebars from "handlebars";
import { ClientProxy } from "@nestjs/microservices";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Language } from "@prisma/client";
import { Type } from "class-transformer";
// import { TwilioService } from "../../providers/twilio/twilio.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly nodemailerService: NodemailerService,
    @Inject("teste") private readonly webhook: ClientProxy,
    // private readonly twilioService: TwilioService,
  ) {}

  async createUser(dto: UsersCreateDto): Promise<MessageDto> {
    const dto = {
      businessId: string;

      firstName: string;

      lastName: string;

      username: string;

      nationalId: string;

      password: string;

      birthDate?: string;

      language?: Language;

      darkMode?: boolean;

      emails: EmailDto[];

      telephones: TelephoneDto[];
    };
    await this.usersRepository.alreadyExists({
      id: null,
      businessId: dto.businessId,
      emails: dto.emails,
      nationalId: dto.nationalId,
      phones: dto.telephones,
      username: dto.username,
    });

    const User = new UsersEntity();
    User.create = dto;

    const Emails = dto.emails.map((emailObj) => {
      const Email = new UserEmailsEntity();
      Email.create = {
        type: emailObj.type,
        email: emailObj.email,
        userId: User.id,
      };
      return Email;
    });

    const Phones = dto.telephones.map((phoneObj) => {
      const Phone = new UserTelephonesEntity();
      Phone.create = {
        type: phoneObj.type,
        telephone: phoneObj.number,
        userId: User.id,
      };
      return Phone;
    });

    await this.usersRepository.create(User, Emails, Phones);

    const createUserTemplate = resolve(
      mainDirname,
      "src",
      "providers",
      "nodemailer",
      "templates",
      "create-user.hbs",
    );

    const variables = {
      name: User.firstName,
      link: env.URL_FRONT + "/confirm-email/" + Security.encrypt(User.id),
    };

    const templateFileContent = await fs.promises.readFile(createUserTemplate, {
      encoding: "utf-8",
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    const html = parseTemplate(variables);

    for (const Email of Emails) {
      await this.nodemailerService.sendEmail({
        to: Security.decrypt(Email.email),
        subject: "Confirmação de e-mail",
        html,
      });
    }

    // !TODO: Implementar envio de SMS
    // for (const Phone of Phones) {
    //   await this.twilioService
    //     .sendSMS(Security.decrypt(Phone.telephone), "Confirmação de telefone")
    //     .catch((err) => {
    //       throw new UnauthorizedException(err.message);
    //     });
    // }

    this.webhook
      .emit("webhook", {
        test: "event",
      })
      .subscribe((data) => {
        console.log("createUser 111", data);
      });

    return { message: "Usuário criado com sucesso!" };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.decode(refreshToken);
    if (
      !payload ||
      !payload.ses ||
      !payload.sub ||
      payload.type !== "refresh" ||
      payload.exp * 1000 < new Date().getTime()
    ) {
      throw new UnauthorizedException("Token inválido");
    }

    const userId = Security.decrypt(payload.sub);
    const usersFound = await this.usersRepository.findById(userId);

    const refreshTokenFound = await this.redisService.get(refreshToken);
    if (refreshTokenFound) {
      throw new UnauthorizedException("Refresh token já utilizado");
    }

    const sessionId = Security.decrypt(payload.ses);
    const sessionFound = await this.redisService.get(sessionId);
    if (sessionFound) this.redisService.del(sessionId);
    await this.redisService.set(
      "session-" + usersFound.id,
      "session",
      env.SESSION_EXPIRES,
    );

    const expInMills = payload.exp * 1000;
    const currentInMills = new Date().getTime();
    const differenceInMills = expInMills - currentInMills;
    const differenceInSeconds = Math.floor(differenceInMills / 1000);

    await this.redisService.set(
      refreshToken,
      "refresh-token",
      differenceInSeconds,
    );

    return Generate.accessToken(
      sessionId,
      usersFound.id,
      env.SESSION_EXPIRES,
      this.jwtService,
    );
  }
}
