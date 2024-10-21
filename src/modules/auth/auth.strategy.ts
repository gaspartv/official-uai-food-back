import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { env } from "../../configs/env";
import { AuthService } from "../../modules/auth/auth.service";
import { UsersEntity } from "../../modules/users/users.entity";
import { HandleDate } from "../../utils/handle-date.util";
import { RedisService } from "../../providers/redis/redis.service";
import { UsersRepository } from "../../modules/users/users.repository";
import { AccessTokenDto } from "../../modules/auth/dtos/auth.acess-token.dto";
import { Generate } from "../../utils/generate.utils";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    super({
      usernameField: "username",
    });
  }

  async validate(username: string, password: string): Promise<AccessTokenDto> {
    const usersFound = await this.authService.validateUser(username, password);
    const User = new UsersEntity(usersFound);
    User.lastLoginAt = HandleDate.UTC(new Date(), -3);
    User.updateDate = HandleDate.UTC(new Date(), -3);
    await this.usersRepository.update(User);

    const sessionId = "session-" + User.id;
    const sessionFound = await this.redisService.get(sessionId);
    if (sessionFound) await this.redisService.del(sessionId);
    await this.redisService.set(sessionId, "session", env.SESSION_EXPIRES);

    return Generate.accessToken(
      sessionId,
      usersFound.id,
      env.SESSION_EXPIRES,
      this.jwtService,
    );
  }
}
