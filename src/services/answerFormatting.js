const { Question } = require("../models/questionModel");

// Validate answer dependent on question format middleware

const validateAnswer = async (request, response, next) => {
  const { answer } = request.body;
  const { surveyId, questionId } = request.params;

  // Check if required fields exist
  if (!surveyId || !questionId || answer === undefined) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: surveyId, questionId, or answer.",
    });
  }

  try {
    // Fetch the question data using questionId
    const question = await Question.findById(questionId);
    if (!question) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Initialise a variable to hold validated answer
    let validatedAnswer;

    // Validate based on question format
    if (question.questionFormat === "writtenResponse") {
      // Validate written response answers
      if (!answer || typeof answer !== "string" || answer.trim() === "") {
        return response.status(400).json({
          success: false,
          message: "Invalid written response answer.",
        });
      }
      validatedAnswer = answer;
    } else if (question.questionFormat === "rangeSlider") {
      // Validate range slider answers (0 - 10)
      if (!answer || typeof answer !== "number" || answer < 0 || answer > 10) {
        return response.status(400).json({
          success: false,
          message: "Invalid range slider answer.",
        });
      }
      validatedAnswer = answer;
    } else if (question.questionFormat === "multiChoice") {
      // Validate multiple choice answers
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
      // Return error if the question format is none of the above
      return response.status(400).json({
        success: false,
        message: "Unsupported question format.",
      });
    }

    // Add validated answer to request body
    request.body.validatedAnswer = validatedAnswer;

    // Proceed to next middleware
    next();
  } catch (error) {
    // Handle errors
    console.error("Error validating answer:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { validateAnswer };
