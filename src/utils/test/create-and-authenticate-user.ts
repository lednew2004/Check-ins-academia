import request from "supertest";
import type { FastifyInstance } from "fastify";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post("/users").send({
    name: "john doe",
    email: "johndoe@exampleE2E.com",
    password: "1234567",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "johndoe@exampleE2E.com",
    password: "1234567",
  });

  const { token } = authResponse.body;
  console.log(token); // deve imprimir algo como: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  return {
    token,
  };
}
