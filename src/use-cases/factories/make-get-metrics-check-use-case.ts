import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository";
import { GetMetricsCheckInsUseCase } from "../get-metrics-check-ins";

export function makeGetMetricsCheckUserUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetMetricsCheckInsUseCase(checkInsRepository);

  return useCase;
}
