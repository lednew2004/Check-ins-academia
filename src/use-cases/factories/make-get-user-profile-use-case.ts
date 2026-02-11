import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { GetMetricsCheckInsUseCase } from "../get-metrics-check-ins";
import { GetUserProfileUseCase } from "../getUserProfile";

export function MakeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return useCase;
}
