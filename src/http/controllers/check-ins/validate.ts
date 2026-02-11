import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeValidateCheckInsUseCase } from "../../../use-cases/factories/make-validate-check-ins-use-case";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateRequestQuerySchema = z.object({
    checkInId: z.uuid(),
  });

  const { checkInId } = validateRequestQuerySchema.parse(request.params);

  const validateUseCase = makeValidateCheckInsUseCase();

  const { checkIn } = await validateUseCase.execute({
    checkIn_Id: checkInId,
  });

  return reply.status(204).send({
    checkIn,
  });
}
