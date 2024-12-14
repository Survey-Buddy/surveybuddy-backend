const mongoose = require("mongoose");
const { User } = require("../../src/models/userModel");
const request = require("supertest");
const { app } = require("../../src/server");

describe("POST /users/signup", () => {
  beforeEach(async () => {
    await mongoose.connection.dropDatabase(); // Clear test DB before each test
  });

  it("should create a new user and return a token", async () => {
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.message).toBe("User created successfully.");
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      email: "test@test.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing a required field.");
  });

  it("should return 400 if email is already in use", async () => {
    await User.create({
      firstName: "Existing",
      lastName: "User",
      username: "existinguser",
      email: "test@test.com",
      password: "123456",
    });

    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already in use.");
  });

  it("should return 400 if username is already in use", async () => {
    await User.create({
      firstName: "Existing",
      lastName: "User",
      username: "testuser",
      email: "existing@test.com",
      password: "123456",
    });

    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "new@test.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already in use.");
  });

  it("should return 500 on database error", async () => {
    jest.spyOn(User.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error.");
  });
});
