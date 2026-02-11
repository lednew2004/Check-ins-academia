import { it, describe, expect, beforeEach } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memoy-gym-repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymRepository;
let sut: SearchGymsUseCase;

describe("Search gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("it should be able to search gym", async () => {
    await gymsRepository.create({
      title: "JavaScript gym",
      description: null,
      phone: null,
      latitude: -5.0453311,
      longitude: -42.4626358,
    });

    await gymsRepository.create({
      title: "TypeScript gym",
      description: null,
      phone: null,
      latitude: -5.0453311,
      longitude: -42.4626358,
    });

    const { gyms } = await sut.execute({
      query: "TypeScript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "TypeScript gym" }),
    ]);
  });

  it("it should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TypeScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -5.0453311,
        longitude: -42.4626358,
      });
    }

    const { gyms } = await sut.execute({
      query: "TypeScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "TypeScript Gym 21" }),
      expect.objectContaining({ title: "TypeScript Gym 22" }),
    ]);
  });
});
