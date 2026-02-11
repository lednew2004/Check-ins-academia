import { it, describe, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memoy-gym-repository";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-in-repository";
import { ValidateCheckinUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { LateValidateCheckInError } from "./error/late-check-in-validate-error";

let checkinsRepository: InMemoryCheckInRepository;
let sut: ValidateCheckinUseCase;

describe("Validate check-in use case", () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckinUseCase(checkinsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to validate check-in", async () => {
    const validatedCheckin = await checkinsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkIn_Id: validatedCheckin.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkinsRepository.items[0]?.validated_at).toEqual(expect.any(Date));
  });

  it("Should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkIn_Id: "invalid-01",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to validate check-in if time 20 minutes", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));
    const validatedCheckin = await checkinsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOnMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOnMinutesInMs);

    await expect(() =>
      sut.execute({
        checkIn_Id: validatedCheckin.id,
      }),
    ).rejects.toBeInstanceOf(LateValidateCheckInError);
  });
});
