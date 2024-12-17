const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../../src/server");
const { Survey } = require("../../src/models/surveyModel");
const { User } = require("../../src/models/userModel");
const { generateNewToken } = require("../../src/functions/jwtFunctions");

// Initiate globally so can access through file
let userToken;
let userId;

// Setup before all tests
beforeAll(async () => {
  await mongoose.connection.dropDatabase();

  // Create test user to test surveys with
  const testUser = await User.create({
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@user.com",
    password: "hashedpassword",
  });
  // Get user id from new testUser object
  userId = testUser._id;
  // Generate new token for testUser
  userToken = generateNewToken(userId, testUser.username, testUser.email);
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test: GET /surveys
describe("GET /surveys", () => {
  beforeAll(async () => {
    // Create surveys for testUser
    await Survey.create([
      { name: "Survey 1", description: "Desc 1", purpose: "work", userId },
      { name: "Survey 2", description: "Desc 2", purpose: "school", userId },
    ]);
  });

  it("should return all surveys for the logged in user", async () => {
    const response = await request(app)
      .get("/surveys")
      .set("Authorization", `Bearer ${userToken}`);
    // Expect the 2 previously created surveys and a 200 status code
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  // Delete all surveys
  it("should return 404 if no surveys exist for the user", async () => {
    // Delete all from Survey model
    await Survey.deleteMany();
    const response = await request(app)
      .get("/surveys")
      .set("Authorization", `Bearer ${userToken}`);
    // No surveys found and 404 status code
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No surveys found for this user.");
  });
});

// Test: GET /surveys/:surveyId
describe("GET /surveys/:surveyId", () => {
  let surveyId;
  // Create a survey to test
  beforeAll(async () => {
    const survey = await Survey.create({
      name: "Specific Survey",
      description: "Specific Desc",
      purpose: "research",
      userId,
    });
    // Assign the survey _id to surveyId
    surveyId = survey._id;
  });

  it("should return a specific survey by ID", async () => {
    const response = await request(app)
      .get(`/surveys/${surveyId}`)
      .set("Authorization", `Bearer ${userToken}`);
    // Return the above Specific survey name and 200 status code
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
    expect(response.body.message).toBe("surveyId not found.");
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
    expect(response.body.survey.name).toBe("New Survey");
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
