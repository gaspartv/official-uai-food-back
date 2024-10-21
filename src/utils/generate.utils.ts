import { JwtService } from "@nestjs/jwt";
import { Security } from "./security.util";
import { AccessTokenDto } from "../modules/auth/dtos/auth.acess-token.dto";

export class Generate {
  static code(): string {
    const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 9 }, () =>
      alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length)),
    ).join("");
  }

  static accessToken(
    sessionId: string,
    userId: string,
    day: number,
    jwtService: JwtService,
  ): AccessTokenDto {
    const payload = {
      sub: Security.encrypt(userId),
      ses: Security.encrypt(sessionId),
    };
    return {
      accessToken: jwtService.sign(
        { ...payload, type: "access" },
        {
          expiresIn: day,
        },
      ),
      refreshToken: jwtService.sign(
        { ...payload, type: "refresh" },
        {
          expiresIn: day * 30,
        },
      ),
    };
  }
}
