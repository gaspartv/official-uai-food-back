import { UsersCreateDto } from "./dtos/users.create.dto";
import { UsersRepository } from "./users.repository";
import { UsersEntity } from "./users.entity";
import { UsersViewModel } from "./view-models/users.view-model";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Security } from "../../utils/security.util";
import { env } from "../../configs/env";
import { Generate } from "../../utils/generate.utils";
import { RedisService } from "../../providers/redis/redis.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: UsersCreateDto): Promise<UsersViewModel> {
    await this.usersRepository.alreadyExists(emailObject.email, dto.username);

    const User = new UsersEntity();
    User.create = dto;

    const userCreate = await this.usersRepository.create(User);

    const UserViewModel = new UsersViewModel(userCreate);
    return UserViewModel.response;
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
    if (sessionFound) await this.redisService.del(sessionId);
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
