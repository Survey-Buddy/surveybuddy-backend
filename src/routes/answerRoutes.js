const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateQAndAs,
  questionBelongsToSurvey,
} = require("../services/questionAnswerServices");
const {
  newAnswer,
  newRegisteredAnswer,
  getQuestionAnswers,
  getSurveyAnswers,
} = require("../controllers/answerController");
const { checkUserAuthorisaton } = require("../services/authServices");
const { authMiddleware } = require("../functions/jwtFunctions");

// prefix: '/surveys/:surveyId/answers'

// Answers Router Paths
// Answers cannot be edited by anyone
// Answers can only be deleted by a manager

router.get(
  "/:questionId",
  authMiddleware,
  validateQAndAs,
  questionBelongsToSurvey,
  getQuestionAnswers
);

router.get("/", authMiddleware, questionBelongsToSurvey, getSurveyAnswers);

// Answers can be created by any unregistered user

router.post("/:questionId", validateQAndAs, questionBelongsToSurvey, newAnswer);

// Answers can only be created by registered users

router.post(
  "/:questionId/registeredAnswer",
  authMiddleware,
  validateQAndAs,
  questionBelongsToSurvey,
  newRegisteredAnswer
);

// router.delete("/deleteAnswer", answerController.deleteAnswers);

// Route for tracked survey results - only one set of answers per assigned respondent
// router.post("/newTrackedAnswer/:userId", checkUser, answerController.newTrackedAnswer)

module.exports = router;
