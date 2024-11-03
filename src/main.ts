import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { env } from "./configs/env";
import cookieParser from "cookie-parser";
import compression from "compression";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import { join } from "path";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.use(compression());

  app.use("/", express.static(join(__dirname, "..", "public")));

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [env.RABBITMQ_URL],
      noAck: false,
      queue: env.RABBITMQ_SEND,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Uai-Food")
    .setDescription("API para o aplicativo Uai-Food")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "docs/json",
  });

  await app.listen(
    {
      port: env.PORT,
      host: "0.0.0.0",
    },
    () => Logger.log(env.PORT, "ServerStarted"),
  );
}
bootstrap().then((r) => r);
