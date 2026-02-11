import { it, describe, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { compare, hash } from "bcryptjs";
import { AlreadyExistEmailError } from "./error/already-exist-email-error";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./error/invalid-credentials-error";

let UsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(UsersRepository);
  });

  it("Should be able to authenticate", async () => {
    await UsersRepository.create({
      name: "john doe",
      email: "johndoe@example",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Should not be able to authenticate wrong email", async () => {
    await UsersRepository.create({
      name: "john doe",
      email: "johndoe@example",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example",
        password: "1234567",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate wrong password", async () => {
    await UsersRepository.create({
      name: "john doe",
      email: "johndoe@.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
