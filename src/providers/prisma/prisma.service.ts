import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    Logger.log("Prisma connected", "PrismaService");
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    Logger.warn("Prisma disconnected", "PrismaService");
    await this.$disconnect();
  }

  extends() {
    return this.$extends({});
  }
}
