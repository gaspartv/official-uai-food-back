import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { RedisService } from "../../providers/redis/redis.service";
import { IS_PUBLIC_KEY } from "../../common/decorators/is-public.decorator";
import { Security } from "../../utils/security.util";
import { UsersRepository } from "../../modules/users/users.repository";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException("Token não encontrado");

    try {
      const payload = this.jwtService.decode(token);
      if (
        !payload ||
        !payload.ses ||
        !payload.sub ||
        payload.type !== "access" ||
        payload.exp * 1000 < new Date().getTime()
      ) {
        throw new UnauthorizedException("Token inválido");
      }
      request["sign"] = payload;

      const sessionId = Security.decrypt(payload.ses);
      const session = await this.redisService.get(sessionId);
      if (!session) throw new UnauthorizedException("Token inválido");

      const userId = Security.decrypt(payload.sub);
      request["user"] = await this.usersRepository.findById(userId);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
