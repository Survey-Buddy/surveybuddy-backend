const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  newQuestion,
  editQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
} = require("../controllers/questionController");
const { authMiddleware } = require("../functions/jwtFunctions");
const { validateQAndAs } = require("../services/questionAnswerServices");
const validateObjectIdParams = require("../services/validateObjects");

// Question Router Paths
// Prefix: '/surveys/:surveyId/questions'

// Get all questions for a specific survey

router.get("/", validateObjectIdParams, getQuestions);

// Get a specific question by Id

router.get("/:questionId", validateObjectIdParams, getQuestion);

// Create a new question for a specific survey

router.post("/", authMiddleware, validateObjectIdParams, newQuestion);

// Update a question for a specific survey
// ** Future feature

// router.patch(
//   "/:questionId/editQuestion",
//   authMiddleware,
//   isCreator(Question, "questionId"),
//   editQuestion
// );

// Delete a question from a specific survey
// ** Future feature

// router.delete(
//   "/:questionId/deleteQuestion",
//   authMiddleware,
//   isCreator(Question, "questionId"),
//   deleteQuestion
// );

module.exports = router;
