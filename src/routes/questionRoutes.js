const express = require("express");
const router = express.Router();
const {
  newQuestion,
  editQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const { validateQAndAs } = require("../services/questionAnswerServices");
const { authMiddleware } = require("../functions/jwtFunctions");
const { isCreator } = require("../services/rolesServices");
const { Question } = require("../models/questionModel");

// Question Router Paths
// Nested under survey routes
// '/surveys/:surveyId/questions'

// Get all questions for a specific survey
// GET - '/surveys/:surveyId/questions'
router.get("/", getQuestions);

// Create a new question for a specific survey
// POST - '/surveys/:surveyId/questions'
router.post("/", authMiddleware, validateQAndAs, newQuestion);

// Update a question for a specific survey
// PATCH - '/surveys/:surveyId/questions/:questionId/editQuestion'
router.patch(
  "/:questionId/editQuestion",
  authMiddleware,
  isCreator(Question, "questionId"),
  editQuestion
);

// Delete a question from a specific survey
// DELETE - '/surveys/:surveyId/questions//:questionId/deleteQuestion'
router.delete(
  "/:questionId/deleteQuestion",
  authMiddleware,
  isCreator(Question, "questionId"),
  deleteQuestion
);

module.exports = router;
