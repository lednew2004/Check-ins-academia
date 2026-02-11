import { it, describe, expect, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { compare, hash } from "bcryptjs";
import { AlreadyExistEmailError } from "./error/already-exist-email-error";

let UsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(UsersRepository);
  });

  it("Should be able to register", async () => {
    const { user } = await sut.execute({
      name: "john doe",
      email: "johnDoe@example",
      password: "124567",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("It should not be possible to register with a duplicate email", async () => {
    const email = "johnDoe@example";
    await UsersRepository.create({
      name: "john doe",
      email,
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        name: "john doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(AlreadyExistEmailError);
  });

  it("should be possible for the password to generate a hash", async () => {
    const { user } = await sut.execute({
      name: "john doe",
      email: "johndoe@example",
      password: "123456",
    });

    const doThePasswordMatchs = await compare("123456", user.password_hash);

    expect(doThePasswordMatchs).toBe(true);
  });
});
