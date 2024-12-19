const { Question } = require("../models/questionModel");

const validateAnswer = async (request, response, next) => {
  const { answer } = request.body;
  const { surveyId, questionId } = request.params;

  console.log(answer);

  if (!surveyId || !questionId || answer === undefined) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: surveyId, questionId, or answer.",
    });
  }

  try {
    // Fetch the question data
    const question = await Question.findById(questionId);
    if (!question) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Initialise validated answer variable
    let validatedAnswer;

    if (question.questionFormat === "writtenResponse") {
      if (!answer || typeof answer !== "string" || answer.trim() === "") {
        return response.status(400).json({
          success: false,
          message: "Invalid written response answer.",
        });
      }
      validatedAnswer = answer;
    } else if (question.questionFormat === "rangeSlider") {
      if (!answer || typeof answer !== "number" || answer < 0 || answer > 10) {
        return response.status(400).json({
          success: false,
          message: "Invalid range slider answer.",
        });
      }
      validatedAnswer = answer;
    } else if (question.questionFormat === "multiChoice") {
      const validChoices = ["answerA", "answerB", "answerC", "answerD"];
      if (!answer || !validChoices.includes(answer)) {
        return response.status(400).json({
          success: false,
          message: "Invalid multi choice answer format.",
        });
      }
      validatedAnswer = answer;
      console.log(answer);
    } else {
      return response.status(400).json({
        success: false,
        message: "Unsupported question format.",
      });
    }

    // Add validated answer to request body
    request.body.validatedAnswer = validatedAnswer;
    console.log(validatedAnswer);

    next();
  } catch (error) {
    console.error("Error validating answer:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { validateAnswer };
