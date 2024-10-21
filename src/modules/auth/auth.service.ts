import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../modules/users/users.repository";
import * as bcrypt from "bcrypt";
import { UsersResponseDto } from "../../modules/users/dtos/users.response.dto";

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UsersResponseDto> {
    const user = await this.usersRepository.findByUsername(username);
    if (user.isVerified === false) {
      throw new UnauthorizedException("Email não verificado");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsCorrect) {
      throw new UnauthorizedException("Email ou senha inválido");
    }
    return user;
  }
}
