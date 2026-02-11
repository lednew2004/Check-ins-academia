import { expect, describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { prisma } from "../../../lib/prisma";

describe("Register (e2e)", () => {
  beforeEach(async () => {
    await prisma.checkIn.deleteMany();
    await prisma.gym.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    app.close();
  });
  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "john doe",
      email: "johndoe@exampleE2E.com",
      password: "1234567",
    });

    expect(response.statusCode).toEqual(201);
  });
});
