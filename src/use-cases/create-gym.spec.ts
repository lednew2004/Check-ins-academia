import { it, describe, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memoy-gym-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymRepository;
let sut: CreateGymUseCase;

describe("Create gym use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new CreateGymUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "javaScript",
      description: null,
      phone: null,
      latitude: -5.0453311,
      longitude: -42.4626358,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
