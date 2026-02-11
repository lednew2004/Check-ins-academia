import { hash } from "bcryptjs";
import type { User } from "../../generated/prisma/client";
import type { UsersRepository } from "../repositories/users-repository";
import { AlreadyExistEmailError } from "./error/already-exist-email-error";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const withEmailUser = await this.UsersRepository.findByEmail(email);
    const password_hash = await hash(password, 6);
    if (withEmailUser) {
      throw new AlreadyExistEmailError();
    }

    const user = await this.UsersRepository.create({
      email,
      name,
      password_hash,
    });

    return {
      user,
    };
  }
}
