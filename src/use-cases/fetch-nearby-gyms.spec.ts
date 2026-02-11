import { it, describe, expect, beforeEach } from "vitest";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memoy-gym-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("it should be able to search gyms not distance", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "",
      phone: "",
      latitude: -5.0453311,
      longitude: -42.4626358,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: "",
      phone: "",
      latitude: -5.0737341,
      longitude: -41.6926984,
    });

    const { gyms } = await sut.execute({
      userLatitude: -5.0453311,
      userLongitude: -42.4626358,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
