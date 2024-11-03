import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { env } from "../../configs/env";

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    const from = `"Equipe Uai Food" <${env.SMTP_USER}>`;
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };

    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      });
      return await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(err);
    }
  }
}
