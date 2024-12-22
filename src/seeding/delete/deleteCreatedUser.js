require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("../../models/userModel");
const { Survey } = require("../../models/surveyModel");
const { Question } = require("../../models/questionModel");
const { Answer } = require("../../models/answersModel");

const MONGO_URI = process.env.DATABASE_URL;

// Run command `npm run deleteCreatedUser`

// Delete the created user and their Survey, Question and Answer data
const deleteCreatedUser = async () => {
  try {
    // Connect to the database
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database");

    // Find the user by email
    const userEmail = "tommy2@example.com"; // Seed created user email in ./create/createUser.js
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log(`No user found with email: ${userEmail}`);
      return;
    }

    console.log("User found:", user);

    // Delete all surveys created by the user
    const surveys = await Survey.find({ userId: user._id });
    const surveyIds = surveys.map((survey) => survey._id);

    await Survey.deleteMany({ userId: user._id });
    console.log("Deleted surveys created by the user:", surveys);

    // Delete all questions associated with the user's surveys
    const questions = await Question.find({ surveyId: { $in: surveyIds } });
    const questionIds = questions.map((question) => question._id);

    await Question.deleteMany({ surveyId: { $in: surveyIds } });
    console.log(
      "Deleted questions associated with the user's surveys:",
      questions
    );

    // Delete all answers associated with the user's questions
    const answers = await Answer.find({ questionId: { $in: questionIds } });

    await Answer.deleteMany({ questionId: { $in: questionIds } });
    console.log(
      "Deleted answers associated with the user's questions:",
      answers
    );

    // Delete the user
    await User.deleteOne({ _id: user._id });
    console.log("User deleted successfully:", user);
  } catch (error) {
    console.error("Error deleting user and associated data:", error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  }
};

// Call the function
deleteCreatedUser();
