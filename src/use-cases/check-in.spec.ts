import { it, describe, expect, beforeEach, vi, afterEach } from "vitest";
import { CheckInsUseCase } from "./check-in";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-in-repository";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memoy-gym-repository";
import { Decimal } from "@prisma/client/runtime/client";
import { MaxDistanceError } from "./error/max-distance-error";
import { MaxNumberOfCheckInsError } from "./error/max-number-check-ins-error";
let checkInRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInsUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInsUseCase(checkInRepository, gymRepository);

    gymRepository.create({
      id: "gym-1",
      title: "javascript",
      description: "",
      phone: "",
      latitude: -5.0453311,
      longitude: -42.4626358,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("it should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gym_id: "gym-1",
      user_id: "user-1",
      userLatitude: -5.0453311,
      userLongitude: -42.4626358,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("it not should be able to check in same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));
    await sut.execute({
      gym_id: "gym-1",
      user_id: "user-1",
      userLatitude: -5.0453311,
      userLongitude: -42.4626358,
    });

    await expect(() =>
      sut.execute({
        gym_id: "gym-1",
        user_id: "user-1",
        userLatitude: -5.0453311,
        userLongitude: -42.4626358,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("it should be able to check in but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0));
    await sut.execute({
      gym_id: "gym-1",
      user_id: "user-1",
      userLatitude: -5.0453311,
      userLongitude: -42.4626358,
    });

    vi.setSystemTime(new Date(2022, 0, 23, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gym_id: "gym-1",
      user_id: "user-1",
      userLatitude: -5.0453311,
      userLongitude: -42.4626358,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("it not should be able to check-in in distance", async () => {
    gymRepository.items.push({
      id: "gym-2",
      title: "javascript",
      description: "",
      phone: "",
      latitude: new Decimal(-5.0925962),
      longitude: new Decimal(-42.2156146),
    });

    await expect(() =>
      sut.execute({
        gym_id: "gym-2",
        user_id: "user-1",
        userLatitude: -5.0453311,
        userLongitude: -42.4626358,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
