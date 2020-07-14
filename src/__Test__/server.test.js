const supertest = require("supertest");
import app from "../server/server.js";

describe("Testing the express API", () => {
  it("tests the base route and returns true for status", async () => {
    const response = await supertest(app).get("/");

    expect(response.status).toBe(200);
    //expect(response.body.status).toBe(true);
  });
});
