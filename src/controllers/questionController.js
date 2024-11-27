const { Question } = require("../models/questionModel");

exports.newQuestion = async (request, response) => {
  const { surveyId, questionNumber, questionFormat, question, answer } =
    request.body;
  if (!surveyId || !questionNumber || !questionFormat || !question || !answer) {
    return response.status(404).json({
      success: false,
      message: "Missing required question field.",
    });
  }
  try {
    const newQuestion = await new Question({
      surveyId,
      questionNumber,
      questionFormat,
      question,
      answer,
    });
    await newQuestion.save();

    return response.status(201).json({
      success: true,
      message: "Question successfully created.",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editQuestion = async (request, response) => {
  const { questionId, questionFormat, question, answer } = request.body;

  if (!questionId) {
    return response.status(401).json({
      success: false,
      message: "Missing required field.",
    });
  }

  if (!questionFormat && !question && !answer) {
    return response.status(404).json({
      success: false,
      message: "No question data to update.",
    });
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { questionFormat, question, answer },
      { new: true }
    );

    return response.status(201).json({
      success: true,
      message: "Question updated.",
      updatedQuestion: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteQuestion = async (request, response) => {
  try {
    // Question deletion logic here
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
