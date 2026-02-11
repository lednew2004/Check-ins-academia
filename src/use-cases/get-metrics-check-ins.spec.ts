import { it, describe, expect, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-in-repository";
import { GetMetricsCheckInsUseCase } from "./get-metrics-check-ins";

let checkInRepository: InMemoryCheckInRepository;
let sut: GetMetricsCheckInsUseCase;

describe("Get metrics user check-ins use case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetMetricsCheckInsUseCase(checkInRepository);
  });

  it("it should be able to get metrics check-ins", async () => {
    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-02",
    });

    const { checkInsCount } = await sut.execute({
      user_id: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
