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
  await mongoose.connection.dropDatabase();

  // Create a test user and generate a token
  const testUser = await User.create({
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@user.com",
    password: "hashedpassword",
  });

  userId = testUser._id;
  userToken = generateNewToken(userId, testUser.username, testUser.email);

  // Create a test survey
  const testSurvey = await Survey.create({
    name: "Test Survey",
    description: "A survey for testing questions",
    purpose: "work",
    userId,
  });

  surveyId = testSurvey._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /surveys/:surveyId/questions", () => {
  beforeAll(async () => {
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
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  it("should return 400 if surveyId is invalid", async () => {
    const response = await request(app)
      .get(`/surveys/invalidId/questions`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid surveyId format.");
  });

  it("should return 404 if no questions are found", async () => {
    await Question.deleteMany();

    const response = await request(app)
      .get(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No questions found for this survey.");
  });
});

describe("GET /surveys/:surveyId/questions/:questionId", () => {
  let questionId;

  beforeAll(async () => {
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
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions/${questionId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.question).toBe("What is your favorite food?");
  });

  it("should return 400 if questionId is invalid", async () => {
    const response = await request(app)
      .get(`/surveys/${surveyId}/questions/invalidId`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid questionId format.");
  });

  it("should return 404 if the question is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/surveys/${surveyId}/questions/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Question not found.");
  });
});

describe("POST /surveys/:surveyId/questions", () => {
  it("should create a new question for a survey", async () => {
    const response = await request(app)
      .post(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        questionNum: 3,
        questionFormat: "writtenResponse",
        question: "What do you like most about your favorite food?",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.question.question).toBe(
      "What do you like most about your favorite food?"
    );
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post(`/surveys/${surveyId}/questions`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        questionNum: 4,
        questionFormat: "multiChoice",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Missing required field to create question."
    );
  });

  it("should return 400 if surveyId is invalid", async () => {
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

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid surveyId format.");
  });
});
