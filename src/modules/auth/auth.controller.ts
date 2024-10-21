import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { IsPublic } from "../../common/decorators/is-public.decorator";
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  @Throttle({ default: { limit: 2, ttl: 10000 } })
  @IsPublic()
  @Post("sign-in")
  @UseGuards(AuthGuard("local"))
  signIn(@Req() req: Request) {
    return req.user;
  }
}
