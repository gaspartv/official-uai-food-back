import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { UsersCreateDto } from "./dtos/users.create.dto";
import { UsersViewModel } from "./view-models/users.view-model";
import { UsersService } from "./users.service";
import { IsPublic } from "../../common/decorators/is-public.decorator";
import { Throttle } from "@nestjs/throttler";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MessageDto } from "../../common/dtos/message.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @IsPublic()
  @Post("create")
  @ApiOperation({ summary: "Rota para criar um novo usuário" })
  @ApiResponse({ status: 201, type: UsersViewModel })
  @HttpCode(201)
  createUser(@Body() body: UsersCreateDto): Promise<MessageDto> {
    return this.usersService.createUser(body);
  }

  @Throttle({ default: { limit: 1, ttl: 120000 } })
  @IsPublic()
  @Get("refresh-token")
  @HttpCode(200)
  async refreshToken(@Query("refreshToken") refreshToken: string) {
    return await this.usersService.refreshToken(refreshToken);
  }
}
