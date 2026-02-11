import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetMetricsCheckUserUseCase } from "../../../use-cases/factories/make-get-metrics-check-use-case";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetMetricsCheckUserUseCase();

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    user_id: request.user.sub,
  });

  return reply.status(200).send({
    checkInsCount,
  });
}
