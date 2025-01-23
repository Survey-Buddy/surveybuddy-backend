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

// Nested routes for managing questions related to a specific survey

router.use("/:surveyId/questions", questionRoutes);

// Get all surveys created by authenticated user

router.get("/", authMiddleware, getAllSurveys);

// Get specific survey details by id

router.get("/:surveyId", getSpecificSurvey);

// Create a new survey

router.post("/", authMiddleware, newSurvey);

// Update an existing survey by Id

router.patch(
  "/:surveyId/editSurvey",
  authMiddleware,
  validateObjectIdParams,
  isCreator(Survey, "surveyId"),
  editSurvey
);

// Delete an existing survey by Id

router.delete(
  "/:surveyId/deleteSurvey",
  authMiddleware,
  isCreator(Survey, "surveyId"),
  deleteSurvey
);

module.exports = router;
