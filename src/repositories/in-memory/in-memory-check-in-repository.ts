import { randomUUID } from "node:crypto";
import type { CheckIn, Prisma } from "../../../generated/prisma/client";
import type { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    const checkInSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const checkInOnStartandEnd =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

      return checkIn.user_id === userId && checkInOnStartandEnd;
    });

    if (!checkInSameDate) {
      return null;
    }

    return checkInSameDate;
  }

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInValidate = this.items.findIndex(
      (item) => item.id === checkIn.id,
    );

    if (checkInValidate >= 0) {
      this.items[checkInValidate] = checkIn;
    }

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
