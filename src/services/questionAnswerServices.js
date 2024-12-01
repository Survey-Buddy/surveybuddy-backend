const { Question } = require("../models/questionModel");

// Service to validate answer adheres to correct question format

exports.validateQAndAs = async (request, response, next) => {
  const { answer } = request.body;
  const { questionId } = request.params;

  let questionFormat = request.body.questionFormat;

  // If not question format, find and assign value
  if (!questionFormat) {
    const question = await Question.findById(questionId);
    if (question) {
      questionFormat = question.questionFormat;
    }
  }

  // Validate required fields
  if (!questionFormat || !answer) {
    return response.status(400).json({
      success: false,
      message: "Missing required fields: questionFormat or answer.",
    });
  }

  // Define valid types of Questions and Answers
  const validQuestions = ["multiChoice", "range", "writtenResponse"];
  const validChoices = ["a", "b", "c", "d"];
  const validRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Validate question type
  if (!validQuestions.includes(questionFormat)) {
    return response.status(400).json({
      success: false,
      message:
        "Invalid question format. Must be one of: multiChoice, range, writtenResponse.",
    });
  }

  // Convert answer to lowercase if string
  let normalisedAnswer =
    typeof answer === "string" ? answer.toLowerCase() : answer;

  // Perform validation based on question type
  if (
    questionFormat === "multiChoice" &&
    !validChoices.includes(normalisedAnswer)
  ) {
    return response.status(400).json({
      success: false,
      message: "Multi-choice answers must be one of: A, B, C, or D.",
    });
  }
  if (questionFormat === "range" && !validRange.includes(normalisedAnswer)) {
    return response.status(400).json({
      success: false,
      message: "Range answers must be between 1 and 10.",
    });
  }
  if (
    questionFormat === "writtenResponse" &&
    typeof normalisedAnswer !== "string"
  ) {
    return response.status(400).json({
      success: false,
      message: "Written response answers must be a string.",
    });
  }

  console.log("Q & A validated!");
  // If questionFormat and answer passes validation move to next middleware or route
  next();
};

// Service to check if provided question belongs to provided survey

exports.questionBelongsToSurvey = async (request, response, next) => {
  const { surveyId, questionId } = request.params;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    if (question.surveyId.toString() !== surveyId) {
      return response.status(404).json({
        success: false,
        message: "Question does not belong to the provided survey.",
      });
    }

    return next();
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
