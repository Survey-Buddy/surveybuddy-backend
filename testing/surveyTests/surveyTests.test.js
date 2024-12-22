const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../../src/server");
const { Survey } = require("../../src/models/surveyModel");
const { User } = require("../../src/models/userModel");
const { generateNewToken } = require("../../src/functions/jwtFunctions");

// Global variables for test user
let userToken;
let userId;

// Setup before all tests
beforeAll(async () => {
  await mongoose.connection.dropDatabase();

  // Create a test user
  const testUser = await User.create({
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@user.com",
    password: "hashedpassword",
  });

  userId = testUser._id;
  userToken = generateNewToken(userId, testUser.username, testUser.email);
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test: GET /surveys
describe("GET /surveys", () => {
  beforeAll(async () => {
    // Create surveys for the test user
    await Survey.create([
      { name: "Survey 1", description: "Desc 1", purpose: "work", userId },
      { name: "Survey 2", description: "Desc 2", purpose: "school", userId },
    ]);
  });

  it("should return all surveys for the logged in user", async () => {
    const response = await request(app)
      .get("/surveys")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  it("should return 404 if no surveys exist for the user", async () => {
    await Survey.deleteMany();

    const response = await request(app)
      .get("/surveys")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No surveys found for this user.");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/surveys");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authorization token missing. Please sign in."
    );
  });

  it("should return 403 if token is invalid", async () => {
    const response = await request(app)
      .get("/surveys")
      .set("Authorization", `Bearer invalidToken`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Invalid token. Please sign in to access this resource."
    );
  });
});

// Test: GET /surveys/:surveyId
describe("GET /surveys/:surveyId", () => {
  let surveyId;

  beforeAll(async () => {
    const survey = await Survey.create({
      name: "Specific Survey",
      description: "Specific Desc",
      purpose: "research",
      userId,
    });
    surveyId = survey._id;
  });

  it("should return a specific survey by ID", async () => {
    const response = await request(app)
      .get(`/surveys/${surveyId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Specific Survey");
  });

  it("should return 404 if the survey is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/surveys/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No survey with that Id found.");
  });
});

// Test: POST /surveys
describe("POST /surveys", () => {
  it("should create a new survey for the user", async () => {
    const response = await request(app)
      .post("/surveys")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "New Survey",
        description: "A new survey",
        purpose: "fun",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.name).toBe("New Survey");
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post("/surveys")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Incomplete Survey" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing a required field.");
  });
});

// Test: PATCH /surveys/:surveyId/editSurvey
describe("PATCH /surveys/:surveyId/editSurvey", () => {
  let surveyId;

  beforeAll(async () => {
    const survey = await Survey.create({
      name: "Editable Survey",
      description: "Old description",
      purpose: "work",
      userId,
    });
    surveyId = survey._id;
  });

  it("should update the survey's name and description", async () => {
    const response = await request(app)
      .patch(`/surveys/${surveyId}/editSurvey`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated Survey", description: "New description" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.updatedSurvey.name).toBe("Updated Survey");
    expect(response.body.updatedSurvey.description).toBe("New description");
  });

  it("should return 400 if no update fields are provided", async () => {
    const response = await request(app)
      .patch(`/surveys/${surveyId}/editSurvey`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No new survey data to update.");
  });

  it("should return 404 if the survey does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/surveys/${fakeId}/editSurvey`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Non-existent Survey" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("surveyId not found.");
  });

  it("should return 401 if no token provided", async () => {
    const response = await request(app)
      .patch(`/surveys/${surveyId}/editSurvey`)
      .send({ name: "Unauthorised" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authorization token missing. Please sign in."
    );
  });

  it("should return 400 if surveyId is invalid", async () => {
    const response = await request(app)
      .patch(`/surveys/invalidId/editSurvey`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Invalid ID Update" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid surveyId format.");
  });

  it("should return 400 if attempting to update a non-editable field", async () => {
    const response = await request(app)
      .patch(`/surveys/${surveyId}/editSurvey`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ userId: "anotherUserId" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Cannot update this field.");
  });
});

// Test: DELETE /surveys/:surveyId/deleteSurvey
describe("DELETE /surveys/:surveyId/deleteSurvey", () => {
  let surveyId;

  beforeAll(async () => {
    const survey = await Survey.create({
      name: "Deletable Survey",
      description: "A survey to delete",
      purpose: "fun",
      userId,
    });
    surveyId = survey._id;
  });

  it("should delete the survey by ID", async () => {
    const response = await request(app)
      .delete(`/surveys/${surveyId}/deleteSurvey`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Survey deleted successfully.");
  });

  it("should return 404 if the survey does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/surveys/${fakeId}/deleteSurvey`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("surveyId not found.");
  });
});
