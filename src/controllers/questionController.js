const { Question } = require("../models/questionModel");
const { checkIsValidObjectId } = require("../services/mongooseServices");

// Get all questions from a specific survey

exports.getQuestions = async (request, response) => {
  try {
    const { surveyId } = request.params;

    if (!surveyId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: surveyId.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(surveyId)) {
      return response.status(400).json({
        success: false,
        message: "Invalid surveyId format.",
      });
    }

    const isValidObjectId = checkIsValidObjectId(surveyId);
    if (!isValidObjectId) {
      return response.status(400).json({
        success: false,
        message: "Invalid surveyId format.",
      });
    }

    const questions = await Question.find({ surveyId: surveyId });

    if (!questions) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific question

exports.getQuestion = async (request, response) => {
  try {
    const { questionId } = request.params;

    if (!questionId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: questionId.",
      });
    }

    const isValidObjectId = checkIsValidObjectId(questionId);
    if (!isValidObjectId) {
      return response.status(400).json({
        success: false,
        message: "Invalid questionId format.",
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.newQuestion = async (request, response) => {
  const { questionNumber, questionFormat, question, answer } = request.body;
  const { surveyId } = request.params;

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
  const { questionFormat, questionNumber, question, answer } = request.body;
  const { questionId } = request.params;

  if (!questionId) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: questionId.",
    });
  }

  const fieldsToUpdate = {};
  if (questionFormat) fieldsToUpdate.questionFormat = questionFormat;
  if (questionNumber) fieldsToUpdate.questionNumber = questionNumber;
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
      message: "Missing required field: questionId.",
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
