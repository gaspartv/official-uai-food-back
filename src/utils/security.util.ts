import { BadRequestException } from "@nestjs/common";
import * as crypto from "crypto";
import { env } from "../configs/env";

export class Security {
  static encrypt(text: string): string {
    try {
      const algorithm = env.SECURITY_ALGORITHM;

      const encryptionKey = crypto.pbkdf2Sync(
        env.SECURITY_SECRET,
        env.SECURITY_SALT.toString(),
        10000,
        32,
        "sha512",
      );

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(encryptionKey),
        iv,
      );
      let encryptedMessage = cipher.update(text, "utf8", "hex");
      encryptedMessage += cipher.final("hex");
      return iv.toString("hex") + ":" + encryptedMessage;
    } catch {
      throw new BadRequestException("algorítimo de criptografia inválido");
    }
  }

  static decrypt(data: string): string {
    try {
      const algorithm = env.SECURITY_ALGORITHM;

      const encryptionKey = crypto.pbkdf2Sync(
        env.SECURITY_SECRET,
        env.SECURITY_SALT.toString(),
        10000,
        32,
        "sha512",
      );

      const [ivHex, encryptedMessage] = data.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(encryptionKey),
        iv,
      );
      let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf8");
      decryptedMessage += decipher.final("utf8");
      return decryptedMessage;
    } catch {
      throw new BadRequestException("algorítimo de criptografia inválido");
    }
  }

  static hash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }
}
