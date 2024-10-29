import { UsersCreateDto } from "./dtos/users.create.dto";
import { UsersRepository } from "./users.repository";
import { UsersEntity } from "./users.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Security } from "../../utils/security.util";
import { env } from "../../configs/env";
import { Generate } from "../../utils/generate.utils";
import { RedisService } from "../../providers/redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import { UserEmailsEntity } from "../../modules/user-emails/user-emails.entity";
import { UserTelephonesEntity } from "../../modules/user-telephones/user-telephones.entity";
import { MessageDto } from "../../common/dtos/message.dto";
import { NodemailerService } from "../../providers/nodemailer/nodemailer.service";
// import { TwilioService } from "../../providers/twilio/twilio.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly nodemailerService: NodemailerService,
    // private readonly twilioService: TwilioService,
  ) {}

  async createUser(dto: UsersCreateDto): Promise<MessageDto> {
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

    for (const Email of Emails) {
      await this.nodemailerService.sendEmail(
        Security.decrypt(Email.email),
        "Confirmação de e-mail",
        // !TODO: Implementar template de e-mail
        "Confirmação de e-mail",
      );
    }

    // !TODO: Implementar envio de SMS
    // for (const Phone of Phones) {
    //   await this.twilioService
    //     .sendSMS(Security.decrypt(Phone.telephone), "Confirmação de telefone")
    //     .catch((err) => {
    //       throw new UnauthorizedException(err.message);
    //     });
    // }

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
