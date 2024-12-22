const express = require("express");
const router = express.Router({ mergeParams: true });
const { authMiddleware } = require("../functions/jwtFunctions");
const {
  newSurvey,
  editSurvey,
  deleteSurvey,
  getSpecificSurvey,
  getAllSurveys,
} = require("../controllers/surveyController");
const { isCreator } = require("../services/rolesServices");
const { Survey } = require("../models/surveyModel");
const questionRoutes = require("../routes/questionRoutes");
const answerRoutes = require("../routes/answerRoutes");
const validateObjectIdParams = require("../services/validateObjects");

// Nested question child routes

router.use("/:surveyId/questions", questionRoutes);

// Get all User created surveys

router.get("/", authMiddleware, getAllSurveys);

// Get specific survey

router.get("/:surveyId", getSpecificSurvey);

// Create new survey

router.post("/", authMiddleware, newSurvey);

// Update survey

router.patch(
  "/:surveyId/editSurvey",
  authMiddleware,
  validateObjectIdParams,
  isCreator(Survey, "surveyId"),
  editSurvey
);

// Delete survey

router.delete(
  "/:surveyId/deleteSurvey",
  authMiddleware,
  isCreator(Survey, "surveyId"),
  deleteSurvey
);

module.exports = router;
