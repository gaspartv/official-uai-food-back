import { Injectable } from "@nestjs/common";
import { UserEmailsRepository } from "../../modules/user-emails/user-emails.repository";
import { UserEmailsEntity } from "../../modules/user-emails/user-emails.entity";
import { UserEmailsCreateDto } from "../../modules/user-emails/dtos/user-emails.create.dto";

@Injectable()
export class UserEmailsService {
  constructor(private readonly repository: UserEmailsRepository) {}

  async createUserEmails(dto: UserEmailsCreateDto, userId: string) {
    const UserEmail = new UserEmailsEntity();
    UserEmail.create = { ...dto, userId };
    return await this.repository.create(UserEmail);
  }
}
