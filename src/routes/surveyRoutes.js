const express = require("express");
const router = express.Router();
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

// Surveys Router Routes ( /surveys )

// Get all User created surveys
// GET - '/'
router.get("/", authMiddleware, getAllSurveys);

// Get specific survey
// GET - '/:surveyId'
router.get(
  "/:surveyId",
  authMiddleware,
  isCreator(Survey, "surveyId"),
  getSpecificSurvey
);

// Create new survey
// POST - '/'
router.post("/", authMiddleware, newSurvey);

// Update survey
// PATCH - '/:surveyId/editSurvey'
router.patch(
  "/:surveyId/editSurvey",
  authMiddleware,
  isCreator(Survey, "surveyId"),
  editSurvey
);

// Delete survey
// DELETE - '/:surveyId/deleteSurvey'
router.delete(
  "/:surveyId/deleteSurvey",
  authMiddleware,
  isCreator(Survey, "surveyId"),
  deleteSurvey
);

module.exports = router;
