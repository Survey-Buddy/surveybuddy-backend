const { Question } = require("../models/questionModel");

exports.newQuestion = async (request, response) => {
  const { surveyId, questionNumber, questionFormat, question, answer } =
    request.body;
  if (!surveyId || !questionNumber || !questionFormat || !question || !answer) {
    return response.status(400).json({
      success: false,
      message: "Missing required field to create question.",
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

// Edit Question Path (PATCH)

exports.editQuestion = async (request, response) => {
  const { questionId, questionFormat, question, answer } = request.body;

  if (!questionId) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: questionId.",
    });
  }

  const fieldsToUpdate = {};
  if (questionFormat) fieldsToUpdate.questionFormat = questionFormat;
  if (question) fieldsToUpdate.question = question;
  if (answer) fieldsToUpdate.answer = answer;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: questionFormat, question or answer.",
    });
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      fieldsToUpdate,
      { new: true }
    );
    if (!updatedQuestion) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

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

// Delete Question Path (DELETE)

exports.deleteQuestion = async (request, response) => {
  const { questionId } = request.body;

  if (!questionId) {
    return response.status(404).json({
      success: false,
      message: "Required field missing to delete question.",
    });
  }
  try {
    // Delete survey
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Respond to client
    return response.status(201).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
