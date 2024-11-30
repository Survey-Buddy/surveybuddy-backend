const { Question } = require("../models/questionModel");

// Service to validate if User is admin

exports.validateIsAdmin = async (request, response, next) => {
  const { questionId } = request.body;
  const { userId } = request.user;

  if (!questionId || !userId) {
    return response.status(400).json({
      success: false,
      message: "Missing required fields: questionId or userId.",
    });
  }

  try {
    const question = await Question.findById(questionId);

    if (question.userId.toString() !== userId) {
      return response.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    return next();
  } catch (error) {
    console.error("Error validating admin privileges:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
