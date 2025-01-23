const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../../src/server");
const { Survey } = require("../../src/models/surveyModel");
const { Question } = require("../../src/models/questionModel");
const { User } = require("../../src/models/userModel");
const { generateNewToken } = require("../../src/functions/jwtFunctions");

let userToken;
let userId;
let surveyId;

beforeAll(async () => {
  // Clear database before new testing
  await mongoose.connection.dropDatabase();

  // Create a test user and generate a token
  const testUser = await User.create({
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@user.com",
    password: "hashedpassword",
  });

  // Store user data and token
  userId = testUser._id;
  userToken = generateNewToken(userId, testUser.username, testUser.email);

  // Create a test survey for test user
  const testSurvey = await Survey.create({
    name: "Test Survey",
    description: "A survey for testing questions",
    purpose: "work",
    userId,
  });

  surveyId = testSurvey._id;
});

afterAll(async () => {
  // Close database after testing
  await mongoose.connection.close();
});

describe("GET /surveys/:surveyId/questions", () => {
  beforeAll(async () => {
    // Create 2 questions for test survey
    await Question.create([
      {
        surveyId,
        questionNum: 1,
        questionFormat: "multiChoice",
        question: "What is your favorite color?",
        formatDetails: {
          answerA: "Red",
          answerB: "Blue",
          answerC: "Green",
          answerD: "Yellow",
        },
      },
      {
        surveyId,
        questionNum: 2,
        questionFormat: "writtenResponse",
        question: "Why do you like this color?",
      },
    ]);
  });

  it("should return all questions for a survey", async () => {
    // GET request to fetch all questions for survey
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`);

    // Verify the response status and data
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  it("should return 400 if surveyId is invalid", async () => {
    // GET request with invalid survey id
    const response = await request(app)
      .get(`/surveys/invalidId/questions`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check status is 400 and returns correct message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid surveyId format.");
  });

  it("should return 404 if no questions are found", async () => {
    // DELETE all questions for the survey
    await Question.deleteMany();

    // GET request to fetch questions
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check status is 404 and correct message
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No questions found for this survey.");
  });
});

describe("GET /surveys/:surveyId/questions/:questionId", () => {
  let questionId;

  beforeAll(async () => {
    // POST a specificmulti choice question for the survey
    const question = await Question.create({
      surveyId,
      questionNum: 1,
      questionFormat: "multiChoice",
      question: "What is your favorite food?",
      formatDetails: {
        answerA: "Pizza",
        answerB: "Burger",
        answerC: "Pasta",
        answerD: "Salad",
      },
    });

    questionId = question._id;
  });

  it("should return a specific question by ID", async () => {
    // GET request to fetch question by id
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions/${questionId}`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check status is 200, success equals true and data is correct
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.question).toBe("What is your favorite food?");
  });

  it("should return 400 if questionId is invalid", async () => {
    // GET request with invalid question id
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check correct status and message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid questionId format.");
  });

  it("should return 404 if the question is not found", async () => {
    // Create a fake id
    const fakeId = new mongoose.Types.ObjectId();

    // GET request using fake question id
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    // Check status and message
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Question not found.");
  });
});

describe("POST /surveys/:surveyId/questions", () => {
  it("should create a new question for a survey", async () => {
    // POST request to create new question
    const response = await request(app)
      .post(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        questionNum: 3,
        questionFormat: "writtenResponse",
        question: "What do you like most about your favorite food?",
      });

    // Check status, success, and data are correct
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.question.question).toBe(
      "What do you like most about your favorite food?"
    );
  });

  it("should return 400 if required fields are missing", async () => {
    // POST request to create a new question with missing field
    const response = await request(app)
      .post(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        questionNum: 4,
        questionFormat: "multiChoice",
      });

    // Check status and message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Missing required field to create question."
    );
  });

  it("should return 400 if surveyId is invalid", async () => {
    // POST request with invalid survey id
    const response = await request(app)
      .post(`/surveys/invalidId/questions`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        questionNum: 5,
        questionFormat: "multiChoice",
        question: "Invalid survey ID test",
        formatDetails: {
          answerA: "Yes",
          answerB: "No",
          answerC: "Maybe",
          answerD: "Not Sure",
        },
      });

    // Check status and message
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid surveyId format.");
  });
});
