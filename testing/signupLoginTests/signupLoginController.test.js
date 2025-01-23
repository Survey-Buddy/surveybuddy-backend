const mongoose = require("mongoose");
const { User } = require("../../src/models/userModel");
const request = require("supertest");
const { app } = require("../../src/server");

describe("POST /users/signup", () => {
  beforeEach(async () => {
    // Clear test database before each test
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    // Close database after all tests
    await mongoose.connection.close();
  });

  it("should create a new user and return a token", async () => {
    // Create test User
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    // Check response status is 201
    expect(response.status).toBe(201);
    // Check response contains a token
    expect(response.body).toHaveProperty("token");
    // Check response message
    expect(response.body.message).toBe("User created successfully.");
  });

  it("should return 400 if required fields are missing", async () => {
    // Test missing required fields
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      email: "test@test.com",
    });

    // Check response status and message
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

    // POST signup request with duplicate email
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    // Check status and message
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

    // POST signup request with duplicate usernames
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "new@test.com",
      password: "123456",
    });

    // Check status and message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already in use.");
  });

  it("should return 500 on database error", async () => {
    // Test database error handling using mock error
    jest.spyOn(User.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    // POST send signup request
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123456",
    });

    // Check status and message
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error.");
  });

  it("should return 400 if the password is too short", async () => {
    // Test password length validation
    const response = await request(app).post("/users/signup").send({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      email: "test@test.com",
      password: "123",
    });

    // Check status and message
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

    // Check status and message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email format.");
  });
});
