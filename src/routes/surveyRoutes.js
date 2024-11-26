const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../functions/jwtFunctions");
const { checkUserAuthorisaton } = require("../services/authServices");
const surveyController = require("../controllers/surveyController");

// Surveys Router Routes ( /surveys )

router.post(
  "/newSurvey/:userId",
  authMiddleware,
  checkUserAuthorisaton,
  surveyController.newSurvey
);
router.patch(
  "/editSurvey",
  authMiddleware,
  checkUserAuthorisaton,
  surveyController.editSurvey
);
router.delete(
  "/deleteSurvey",
  authMiddleware,
  checkUserAuthorisaton,
  surveyController.deleteSurvey
);

module.exports = router;
