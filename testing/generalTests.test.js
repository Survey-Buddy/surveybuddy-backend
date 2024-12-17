const request = require("supertest");
const { app } = require("../src/server");

console.log(require.resolve("../src/server"));

describe("GET /api/health", () => {
  it("Should return a 200 status and a health check response", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
