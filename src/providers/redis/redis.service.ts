import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { env } from "../../configs/env";

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    });
  }

  async set(key: string, value: string, ttl: number | undefined = undefined) {
    if (ttl) {
      return this.client.set(key, value, "EX", ttl);
    }
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
