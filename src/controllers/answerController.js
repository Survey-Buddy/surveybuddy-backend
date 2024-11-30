const { Answer } = require("../models/answersModel");

// POST - Answers created by any unregistered user

exports.newAnswer = async (request, response) => {
  const { surveyId, questionId, answer } = request.body;

  if (!surveyId || !questionId || !answer) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: surveyId, questionId or answer",
    });
  }

  try {
    const newAnswer = await new Answer({
      surveyId,
      questionId,
      answer,
    });

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

// POST - Answers created by tracked registered users

exports.newRegisteredAnswer = async (request, response) => {
  const { surveyId, questionId, answer } = request.body;
  const { userId } = request.params;

  if (!userId) {
    return response.status(400).json({
      success: false,
      message:
        "Missing required field: userId. You must be logged in to perform this request.",
    });
  }

  if (!surveyId || !questionId || !answer) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: surveyId, questionId or answer",
    });
  }

  try {
    const newAnswer = await new Answer({
      surveyId,
      questionId,
      userId,
      answer,
    });

    return response.status(201).json({
      success: true,
      message: "Registered user answer created successfully.",
      answer: newAnswer,
    });
  } catch (error) {
    console.error("Error creating registered answer:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
