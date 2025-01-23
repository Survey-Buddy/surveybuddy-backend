const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../../src/server");
const { Survey } = require("../../src/models/surveyModel");
const { Question } = require("../../src/models/questionModel");
const { Answer } = require("../../src/models/answersModel");
const { User } = require("../../src/models/userModel");
const { generateNewToken } = require("../../src/functions/jwtFunctions");

let userToken;
let userId;
let surveyId;
let questionId;

beforeAll(async () => {
  // Clear database before tests
  await mongoose.connection.dropDatabase();

  // Create a test user and generate a token
  const testUser = await User.create({
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@user.com",
    password: "hashedpassword",
  });

  // Store userId and token for testing
  userId = testUser._id;
  userToken = generateNewToken(userId, testUser.username, testUser.email);

  // Create a test survey
  const testSurvey = await Survey.create({
    name: "Test Survey",
    description: "A survey for testing answers",
    purpose: "research",
    // Test user created survey
    userId,
  });

  surveyId = testSurvey._id;

  // Create a test question for test survey
  const testQuestion = await Question.create({
    surveyId,
    questionNum: 1,
    questionFormat: "writtenResponse",
    question: "What is your opinion?",
  });

  // Store for later use
  questionId = testQuestion._id;
});

afterAll(async () => {
  // Close database after use
  await mongoose.connection.close();
});

describe("GET /answers/:surveyId/:questionId", () => {
  beforeAll(async () => {
    // Create test answers for the question
    await Answer.create([
      { questionId, answer: "Answer 1" },
      { questionId, answer: "Answer 2" },
    ]);
  });

  it("should return all answers for a question", async () => {
    // GET request to fetch answers for question
    const response = await request(app)
      .get(`/answers/${surveyId}/${questionId}`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check if status is 200 and contains 2 answers
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.answers).toHaveLength(2);
  });

  it("should return 404 if no answers are found", async () => {
    // Delete all answers for the question
    await Answer.deleteMany();

    // GET request to fetch all answers
    const response = await request(app)
      .get(`/answers/${surveyId}/${questionId}`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check if status is 404 and correct message
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "There are no answers for this question."
    );
  });

  it("should return 400 if questionId is invalid", async () => {
    // GET request with invalid questionId
    const response = await request(app)
      .get(`/answers/${surveyId}/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check if status is 400 and return correct message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid questionId format.");
  });
});

describe("GET /answers/:surveyId", () => {
  beforeAll(async () => {
    // POST request - create another question and associated answers for the survey
    const anotherQuestion = await Question.create({
      surveyId,
      questionNum: 2,
      questionFormat: "multiChoice",
      question: "What is your favorite color?",
    });

    await Answer.create([
      { questionId, answer: "Opinion Answer" },
      { questionId: anotherQuestion._id, answer: "Red" },
    ]);
  });

  it("should return all questions with answers for a survey", async () => {
    // GET request to fetch questions with answers
    const response = await request(app)
      .get(`/answers/${surveyId}`)
      .set("Authorization", `Bearer ${userToken}`);
    // Check if response status is 200 and data has 2 questions with answers
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.questionsWithAnswers).toHaveLength(2);
  });

  it("should return 404 if no questions with answers are found", async () => {
    // DELETE all questions and answers
    await Question.deleteMany();
    await Answer.deleteMany();

    // GET request to fetch questions with answers
    const response = await request(app)
      .get(`/answers/${surveyId}`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check if status is 404 and correct message
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "There are no questionsWithAnswers for this question."
    );
  });

  it("should return 400 if surveyId is invalid", async () => {
    // GET request with invalid survey id
    const response = await request(app)
      .get(`/answers/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);
    // Check if status is 400 and correct message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid surveyId format.");
  });
});

describe("POST /answers/:surveyId/:questionId", () => {
  it("should return 400 if required fields are missing", async () => {
    // POST request with missing fields
    const response = await request(app)
      .post(`/answers/${surveyId}/${questionId}`)
      .send({});

    // Check status is 400 and correct message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Missing required field: surveyId, questionId, or answer."
    );
  });

  it("should return 400 if surveyId is invalid", async () => {
    // POST request with invalid survey id
    const response = await request(app)
      .post(`/answers/invalidId/${questionId}`)
      .send({ validatedAnswer: "Invalid survey test" });

    // Check status is 400 and correct message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Missing required field: surveyId, questionId, or answer."
    );
  });

  it("should return 400 if questionId is invalid", async () => {
    // POST request with invalid survey id
    const response = await request(app)
      .post(`/answers/${surveyId}/invalidId`)
      .send({ validatedAnswer: "Invalid question test" });

    // Check status is 200 and correct message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Missing required field: surveyId, questionId, or answer."
    );
  });
});
