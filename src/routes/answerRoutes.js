const express = require("express");
const router = express.Router();
const {
  validateQAndAs,
  questionBelongsToSurvey,
} = require("../services/questionAnswerServices");
const answerController = require("../controllers/answerController");
const { checkUserAuthorisaton } = require("../services/authServices");

// Answers Router Routes
// Answers cannot be edited by anyone
// Answers can only be deleted by an admin

// Answers can be created by any unregistered user

router.post(
  "/newAnswer",
  validateQAndAs,
  questionBelongsToSurvey,
  answerController.newAnswer
);

// Answers can only be created by registered users

router.post(
  "newRegisteredAnswer",
  checkUserAuthorisaton,
  validateQAndAs,
  questionBelongsToSurvey,
  answerController.newRegisteredAnswer
);

// router.delete("/deleteAnswer", answerController.deleteAnswers);

// Route for tracked survey results - only one set of answers per assigned respondent
// router.post("/newTrackedAnswer/:userId", checkUser, answerController.newTrackedAnswer)

module.exports = router;
