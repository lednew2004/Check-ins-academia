import type { CheckIn } from "../../generated/prisma/client";
import type { CheckInsRepository } from "../repositories/check-ins-repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
  user_id: string;
  page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private CheckInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.CheckInsRepository.findManyByUserId(
      user_id,
      page,
    );

    return {
      checkIns,
    };
  }
}
