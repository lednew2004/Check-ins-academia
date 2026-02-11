import type { CheckIn } from "../../generated/prisma/client";
import type { CheckInsRepository } from "../repositories/check-ins-repository";

interface GetMetricsCheckInsUseCaseRequest {
  user_id: string;
}

interface GetMetricsCheckInsUseCaseResponse {
  checkInsCount: number;
}

export class GetMetricsCheckInsUseCase {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
  }: GetMetricsCheckInsUseCaseRequest): Promise<GetMetricsCheckInsUseCaseResponse> {
    const checkInsCount = await this.CheckInsRepository.countByUserId(user_id);

    return {
      checkInsCount,
    };
  }
}
