const mongoose = require("mongoose");
const { Answer } = require("../models/answersModel");
const { Question } = require("../models/questionModel");

// GET - All question answers

exports.getQuestionAnswers = async (request, response) => {
  try {
    const { questionId } = request.params;
    if (!questionId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: questionId.",
      });
    }

    const answers = await Answer.find({
      questionId: questionId,
    });

    // Check is any answers exist
    if (answers.length === 0) {
      return response.status(404).json({
        success: false,
        message: "There are no answers for this question.",
      });
    }

    // Respond to client
    return response.status(200).json({
      success: true,
      data: { answers },
    });
  } catch (error) {
    console.error("Error fetching question answers:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET - All survey answers

exports.getSurveyAnswers = async (request, response) => {
  try {
    const { surveyId } = request.params;

    if (!surveyId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: surveyId.",
      });
    }

    const questionsWithAnswers = await Question.aggregate([
      // Find all the questions that with surveyId
      { $match: { surveyId: new mongoose.Types.ObjectId(surveyId) } },
      {
        $lookup: {
          from: "answers", // Collection to join with
          localField: "_id", // Field in question model to match
          foreignField: "questionId", // Field in answer model to match
          as: "answers", // Output array name
          pipeline: [{ $limit: 100 }], // Limit results
        },
      },
    ]);

    if (questionsWithAnswers.length === 0) {
      return response.status(404).json({
        success: false,
        message: "There are no questionsWithAnswers for this question.",
      });
    }

    return response.status(200).json({
      success: true,
      data: { questionsWithAnswers },
    });
  } catch (error) {
    console.error("Error fetching question answers:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST - Answer created by any unregistered user

exports.newAnswer = async (request, response) => {
  const validatedAnswer = request.body.validatedAnswer;
  const { surveyId, questionId } = request.params;

  if (!surveyId || !questionId || !validatedAnswer) {
    return response.status(400).json({
      success: false,
      message:
        "Missing required field: surveyId, questionId, or validatedAnswer.",
    });
  }

  const answer = validatedAnswer;

  try {
    const newAnswer = await new Answer({
      questionId,
      answer,
    });
    await newAnswer.save();

    return response.status(201).json({
      success: true,
      message: "Answer created successfully.",
      answer: newAnswer,
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST - Answers created by tracked registered users || Inactive

// exports.newRegisteredAnswer = async (request, response) => {
//   const { answer } = request.body;
//   const { surveyId, questionId } = request.params;
//   const { userId } = request.user?.userId;

//   if (!userId) {
//     return response.status(400).json({
//       success: false,
//       message:
//         "Missing required field: userId. You must be logged in to perform this request.",
//     });
//   }

//   if (!surveyId || !questionId || !answer) {
//     return response.status(400).json({
//       success: false,
//       message: "Missing required field: surveyId, questionId or answer",
//     });
//   }

//   try {
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
//     console.error("Error creating registered answer:", error);
//     return response.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
