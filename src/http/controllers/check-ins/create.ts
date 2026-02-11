import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { MakeCheckInsUseCase } from "../../../use-cases/factories/make-check-ins-use-case";
import { MaxNumberOfCheckInsError } from "../../../use-cases/error/max-number-check-ins-error";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    gymId: z.uuid(),
  });

  const createCheckInsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = requestParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInsBodySchema.parse(request.body);

  try {
    const checkInsUseCase = MakeCheckInsUseCase();

    await checkInsUseCase.execute({
      gym_id: gymId,
      user_id: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });
  } catch (err) {
    if (err instanceof MaxNumberOfCheckInsError) {
      return reply.status(429).send({ message: err.message });
    }
  }

  return reply.status(201).send();
}
