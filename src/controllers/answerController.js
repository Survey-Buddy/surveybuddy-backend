const mongoose = require("mongoose");
const { Answer } = require("../models/answersModel");
const { Question } = require("../models/questionModel");

// GET - Fetch all answers for a specific question
exports.getQuestionAnswers = async (request, response) => {
  try {
    const { questionId } = request.params;

    // Check if questionId is provided
    if (!questionId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: questionId.",
      });
    }

    // Find all answers associated with the questionId
    const answers = await Answer.find({
      questionId: questionId,
    });

    // Check if any answers exist
    if (answers.length === 0) {
      return response.status(404).json({
        success: false,
        message: "There are no answers for this question.",
      });
    }

    // Return the found answers
    return response.status(200).json({
      success: true,
      data: { answers },
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching question answers:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET - Fetch all answers for a specific survey
exports.getSurveyAnswers = async (request, response) => {
  try {
    const { surveyId } = request.params;

    // Check if surveyId is provided
    if (!surveyId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: surveyId.",
      });
    }

    // Aggregate questions and their answers for the survey
    const questionsWithAnswers = await Question.aggregate([
      { $match: { surveyId: new mongoose.Types.ObjectId(surveyId) } }, // Match surveyId
      {
        $lookup: {
          from: "answers", // Join with the answers collection
          localField: "_id", // Match the question ID
          foreignField: "questionId", // Match the question ID in answers
          as: "answers", // Output field for the joined data
          pipeline: [{ $limit: 100 }], // Limit the number of answers
        },
      },
    ]);

    // Check if any questions with answers are found
    if (questionsWithAnswers.length === 0) {
      return response.status(404).json({
        success: false,
        message: "There are no questionsWithAnswers for this question.",
      });
    }

    // Return the questions with their answers
    return response.status(200).json({
      success: true,
      data: { questionsWithAnswers },
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching question answers:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST - Create a new answer for any unregistered user
exports.newAnswer = async (request, response) => {
  const validatedAnswer = request.body.validatedAnswer;
  const { surveyId, questionId } = request.params;

  // Check if required fields are provided
  if (!surveyId || !questionId || !validatedAnswer) {
    return response.status(400).json({
      success: false,
      message:
        "Missing required field: surveyId, questionId, or validatedAnswer.",
    });
  }

  const answer = validatedAnswer;

  try {
    // Create a new answer and save it to the database
    const newAnswer = await new Answer({
      questionId,
      answer,
    });
    await newAnswer.save();

    // Respond with the newly created answer
    return response.status(201).json({
      success: true,
      message: "Answer created successfully.",
      answer: newAnswer,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating answer:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST - Create an answer for a registered user (currently inactive)
// exports.newRegisteredAnswer = async (request, response) => {
//   const { answer } = request.body;
//   const { surveyId, questionId } = request.params;
//   const { userId } = request.user?.userId;

//   // Check if userId is provided
//   if (!userId) {
//     return response.status(400).json({
//       success: false,
//       message:
//         "Missing required field: userId. You must be logged in to perform this request.",
//     });
//   }

//   // Check if required fields are provided
//   if (!surveyId || !questionId || !answer) {
//     return response.status(400).json({
//       success: false,
//       message: "Missing required field: surveyId, questionId or answer",
//     });
//   }

//   try {
//     // Create a new answer and save it to the database
//     const newAnswer = await new Answer({
//       surveyId,
//       questionId,
//       userId,
//       answer,
//     });

//     return response.status(201).json({
//       success: true,
//       message: "Registered user answer created successfully.",
//       answer: newAnswer,
//     });
//   } catch (error) {
//     // Handle errors
//     console.error("Error creating registered answer:", error);
//     return response.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
