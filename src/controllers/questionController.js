const { Question } = require("../models/questionModel");
const { checkIsValidObjectId } = require("../services/mongooseServices");
const mongoose = require("mongoose");

// Get all questions from a specific survey
exports.getQuestions = async (request, response) => {
  try {
    const { surveyId } = request.params;

    // Check if surveyId is provided
    if (!surveyId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: surveyId.",
      });
    }

    // Find all questions associated with the surveyId
    const questions = await Question.find({ surveyId: surveyId });

    // Check if any questions exist
    if (questions.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No questions found for this survey.",
      });
    }

    console.log(questions);
    return response.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific question
exports.getQuestion = async (request, response) => {
  try {
    const { questionId } = request.params;

    // Check if questionId is provided
    if (!questionId) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: questionId.",
      });
    }

    // Find the question by its ID
    const question = await Question.findById(questionId);

    // Check if the question exists
    if (!question) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new question
exports.newQuestion = async (request, response) => {
  const { questionNum, questionFormat, question, formatDetails } = request.body;
  const { surveyId } = request.params;

  // Check if required fields are provided
  if (!surveyId || !questionFormat || !question) {
    return response.status(400).json({
      success: false,
      message: "Missing required field to create question.",
    });
  }
  try {
    // Create and save a new question
    const newQuestion = await new Question({
      surveyId,
      questionNum,
      questionFormat,
      question,
      formatDetails,
    });
    await newQuestion.save();

    console.log("Question successfully created: ", newQuestion);

    return response.status(201).json({
      success: true,
      message: "Question successfully created.",
      question: newQuestion,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// // Delete a question
// exports.deleteQuestion = async (request, response) => {
//   const { questionId } = request.body;

//   // Check if questionId is provided
//   if (!questionId) {
//     return response.status(404).json({
//       success: false,
//       message: "Missing required field: questionId.",
//     });
//   }
//   try {
//     // Find and delete the question by its ID
//     const deletedQuestion = await Question.findByIdAndDelete(questionId);

//     // Check if the question exists
//     if (!deletedQuestion) {
//       return response.status(404).json({
//         success: false,
//         message: "Question not found.",
//       });
//     }

//     // Respond with a success message
//     return response.status(201).json({
//       success: true,
//       message: "Question deleted successfully.",
//     });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     return response.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Edit a specific question
// exports.editQuestion = async (request, response) => {
//   const { questionFormat, questionNumber, question, answer } = request.body;
//   const { questionId } = request.params;

//   // Check if questionId is provided
//   if (!questionId) {
//     return response.status(400).json({
//       success: false,
//       message: "Missing required field: questionId.",
//     });
//   }

//   // Prepare the fields to update
//   const fieldsToUpdate = {};
//   if (questionFormat) fieldsToUpdate.questionFormat = questionFormat;
//   if (questionNumber) fieldsToUpdate.questionNumber = questionNumber;
//   if (question) fieldsToUpdate.question = question;
//   if (answer) fieldsToUpdate.answer = answer;

//   // Check if there are any fields to update
//   if (Object.keys(fieldsToUpdate).length === 0) {
//     return response.status(400).json({
//       success: false,
//       message: "Missing required field: questionFormat, question or answer.",
//     });
//   }

//   try {
//     // Find the question by ID and update it with the provided fields
//     const updatedQuestion = await Question.findByIdAndUpdate(
//       questionId,
//       fieldsToUpdate,
//       { new: true }
//     );

//     // Check if the question exists
//     if (!updatedQuestion) {
//       return response.status(404).json({
//         success: false,
//         message: "Question not found.",
//       });
//     }

//     // Respond with the updated question
//     return response.status(201).json({
//       success: true,
//       message: "Question updated.",
//       updatedQuestion: updatedQuestion,
//     });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     return response.status(500).json({ message: "Internal Server Error" });
//   }
// };
