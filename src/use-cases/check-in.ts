import type { CheckIn } from "../../generated/prisma/client";
import type { CheckInsRepository } from "../repositories/check-ins-repository";
import type { GymsRepository } from "../repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "../utils/get-Between-Distance-coordinates";
import { MaxNumberOfCheckInsError } from "./error/max-number-check-ins-error";
import { MaxDistanceError } from "./error/max-distance-error";
import { ResourceNotFoundError } from "./error/resource-not-found-error";

interface CheckInsUseCaseRequest {
  user_id: string;
  gym_id: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInsUseCase {
  constructor(
    private checkinsRepository: CheckInsRepository,
    private GymsRepository: GymsRepository,
  ) {}

  async execute({
    gym_id,
    user_id,
    userLatitude,
    userLongitude,
  }: CheckInsUseCaseRequest): Promise<CheckInsUseCaseResponse> {
    console.log({
      gym_id,
      user_id,
    });
    const gym = await this.GymsRepository.findById(gym_id);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const findCheckinUser = await this.checkinsRepository.findByUserIdAndDate(
      user_id,
      new Date(),
    );

    if (findCheckinUser) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id,
      user_id,
    });

    return {
      checkIn,
    };
  }
}
