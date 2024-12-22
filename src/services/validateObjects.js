const mongoose = require("mongoose");

const validateObjectIdParams = (request, response, next) => {
  const { questionId, surveyId } = request.params;

  // Check if questionId is provided and is a valid ObjectId
  if (questionId && !mongoose.Types.ObjectId.isValid(questionId)) {
    return response.status(400).json({
      success: false,
      message: "Invalid questionId format.",
    });
  }

  // Check if surveyId is provided and is a valid ObjectId
  if (surveyId && !mongoose.Types.ObjectId.isValid(surveyId)) {
    return response.status(400).json({
      success: false,
      message: "Invalid surveyId format.",
    });
  }

  // Proceed to next
  next();
};

module.exports = validateObjectIdParams;
