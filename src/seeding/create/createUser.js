require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../../models/userModel");
const { Survey } = require("../../models/surveyModel");
const { Question } = require("../../models/questionModel");
const { Answer } = require("../../models/answersModel");

const MONGO_URI = process.env.DATABASE_URL;

// Seed DB with a new user with survey, question and answers data
// Run command `npm run createUser` to execute

// If getting `E11000 duplicate key error`, the seeded user exists,
// please delete the user and try again by running `npm run deleteCreatedUser`

const seedDatabase = async () => {
  try {
    // Connect to the database using URI env variables
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);
    // Create a new User
    const newUser = await User.create({
      firstName: "Tom",
      lastName: "Martin",
      username: "Thomaso2",
      email: "tommy2@example.com",
      password: hashedPassword,
    });
    console.log("New user created:", newUser);

    // Create a new survey for the user
    const newSurvey = await Survey.create({
      name: "Dog Behavior Survey",
      description:
        "A survey to understand dog behaviors and owner perspectives.",
      organisation: "Pet Lovers",
      respondents: "public",
      purpose: "research",
      userId: newUser._id,
    });
    console.log("New survey created:", newSurvey);

    // Add questions to the survey
    const questions = [
      {
        surveyId: newSurvey._id,
        questionNum: 1,
        questionFormat: "multiChoice",
        question: "How often does your dog bark?",
        formatDetails: {
          answerA: "Rarely",
          answerB: "Sometimes",
          answerC: "Often",
          answerD: "Always",
        },
      },
      {
        surveyId: newSurvey._id,
        questionNum: 2,
        questionFormat: "rangeSlider",
        question: "On a scale from 1 to 10, how active is your dog?",
        formatDetails: {
          rangeDescription: "no",
          max: 10,
        },
      },
      {
        surveyId: newSurvey._id,
        questionNum: 3,
        questionFormat: "writtenResponse",
        question: "What do you enjoy most about your dog?",
      },
    ];

    const createdQuestions = await Question.insertMany(questions);
    console.log("Questions created:", createdQuestions);

    // Add answers for the questions
    const answers = [
      {
        questionId: createdQuestions[0]._id,
        answer: "answerC",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[1]._id,
        answer: 8,
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[2]._id,
        answer: "Their loyalty and playfulness.",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[0]._id,
        answer: "answerA",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[1]._id,
        answer: 6,
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[2]._id,
        answer: "Their happiness.",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[0]._id,
        answer: "answerB",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[1]._id,
        answer: 7,
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[2]._id,
        answer: "They make me happy.",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[0]._id,
        answer: "answerA",
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[1]._id,
        answer: 4,
        userId: newUser._id,
      },
      {
        questionId: createdQuestions[2]._id,
        answer: "Companionship.",
        userId: newUser._id,
      },
    ];

    const createdAnswers = await Answer.insertMany(answers);
    console.log("Answers created:", createdAnswers);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Disconnect from the database after completion
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  }
};

// Execute the seeding function
seedDatabase();
