const request = require("supertest");
const { app } = require("../src/server");

describe("GET /api/health", () => {
  it("Should return a 200 status and a health check response", async () => {
    // GET request to the health check endpoint
    const response = await request(app).get("/api/health");

    // Check response status is 200
    expect(response.status).toBe(200);

    // Check response body contains ok
    expect(response.body).toEqual({ status: "ok" });
  });
});
