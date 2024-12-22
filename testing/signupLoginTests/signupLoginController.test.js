const mongoose = require("mongoose");
const { User } = require("../../src/models/userModel");
const request = require("supertest");
const { app } = require("../../src/server");

describe("POST /users/signup", () => {
  beforeEach(async () => {
    await mongoose.connection.dropDatabase(); // Clear test DB before each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close DB connection after all tests
  });

  it("should create a new user and return a token", async () => {
    // Test successful user creation
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token"); // Ensure token is returned
    expect(response.body.message).toBe("User created successfully.");
  });

  it("should return 400 if required fields are missing", async () => {
    // Test missing required fields
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      email: "test@test.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing a required field.");
  });

  it("should return 400 if email is already in use", async () => {
    // Test duplicate email
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
    // Test duplicate username
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
    // Test database error handling
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

  it("should return 400 if the password is too short", async () => {
    // Test password validation
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Password must be at least 6 characters long."
    );
  });

  it("should return 400 if email format is invalid", async () => {
    // Test invalid email format
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "invalid-email",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email format.");
  });
});
