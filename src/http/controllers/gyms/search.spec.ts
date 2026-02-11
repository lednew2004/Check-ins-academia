import { expect, describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";
import { prisma } from "../../../lib/prisma";

describe("Search Gym (e2e)", () => {
  beforeEach(async () => {
    await prisma.checkIn.deleteMany();
    await prisma.gym.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to get a gym query", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some Description",
        phone: "11999999999",
        latitude: -5.0453311,
        longitude: -42.4626358,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Gym",
        description: "Some Description",
        phone: "11999999999",
        latitude: -5.0453311,
        longitude: -42.4626358,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: "JavaScript",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
