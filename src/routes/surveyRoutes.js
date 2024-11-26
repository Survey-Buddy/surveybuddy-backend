const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../functions/jwtFunctions");
const { checkUserAuthorisaton } = require("../services/authServices");
const surveyController = require("../controllers/surveyController");

router.post(
  "/newSurvey",
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
