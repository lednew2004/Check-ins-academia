import { it, describe, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { compare, hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./getUserProfile";
import { ResourceNotFoundError } from "./error/resource-not-found-error";

let UsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(UsersRepository);
  });

  it("it should be possible to get the user's profile", async () => {
    UsersRepository.items.push({
      id: "user-1",
      name: "john doe",
      email: "johndoe@example",
      password_hash: await hash("123456", 6),
      created_at: new Date(),
    });

    const { user } = await sut.execute({
      userId: "user-1",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("it not should be possible to get the user's profile wrong id", async () => {
    UsersRepository.items.push({
      id: "user-1",
      name: "john doe",
      email: "johndoe@example",
      password_hash: await hash("123456", 6),
      created_at: new Date(),
    });

    await expect(() =>
      sut.execute({
        userId: "user-2",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
