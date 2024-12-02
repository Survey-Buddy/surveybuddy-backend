const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  newQuestion,
  editQuestion,
  deleteQuestion,
  getQuestion,
  getQuestions,
} = require("../controllers/questionController");
const { validateQAndAs } = require("../services/questionAnswerServices");
const { authMiddleware } = require("../functions/jwtFunctions");
const { isCreator } = require("../services/rolesServices");
const { Question } = require("../models/questionModel");
const answerRoutes = require("../routes/answerRoutes");

// Nested child routes

// router.use("/:questionId/answers", answerRoutes);

// Question Router Paths - prefix: '/surveys/:surveyId/questions'

// Get all questions for a specific survey

router.get("/", getQuestions);

// Get specific questions

router.get("/:questionId", getQuestion);

// Create a new question for a specific survey

router.post("/", authMiddleware, validateQAndAs, newQuestion);

// Update a question for a specific survey

router.patch(
  "/:questionId/editQuestion",
  authMiddleware,
  isCreator(Question, "questionId"),
  editQuestion
);

// Delete a question from a specific survey

router.delete(
  "/:questionId/deleteQuestion",
  authMiddleware,
  isCreator(Question, "questionId"),
  deleteQuestion
);

module.exports = router;
