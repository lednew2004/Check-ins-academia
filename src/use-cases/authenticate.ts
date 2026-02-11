import { compare } from "bcryptjs";
import type { User } from "../../generated/prisma/client";
import type { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./error/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.UsersRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPassowordMacth = await compare(password, user.password_hash);

    if (!doesPassowordMacth) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
