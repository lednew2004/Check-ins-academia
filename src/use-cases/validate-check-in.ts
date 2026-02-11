import dayjs from "dayjs";
import type { CheckIn } from "../../generated/prisma/client";
import type { CheckInsRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { LateValidateCheckInError } from "./error/late-check-in-validate-error";

interface ValidateCheckinUseCaseRequest {
  checkIn_Id: string;
}

interface ValidateCheckinUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckinUseCase {
  constructor(private CheckinsRepository: CheckInsRepository) {}

  async execute({
    checkIn_Id,
  }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {
    const checkIn = await this.CheckinsRepository.findById(checkIn_Id);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const ditanceMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (ditanceMinutesFromCheckInCreation > 20) {
      throw new LateValidateCheckInError();
    }

    checkIn.validated_at = new Date();
    this.CheckinsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
