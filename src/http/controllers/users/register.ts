import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { AlreadyExistEmailError } from "../../../use-cases/error/already-exist-email-error";
import { MakeRegisterUseCase } from "../../../use-cases/factories/make-register-use-case";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = MakeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof AlreadyExistEmailError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
