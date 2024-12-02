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
const { isCreator } = require("../services/rolesServices");

// prefix: '/surveys/:surveyId/answers'

// Answers Router Paths
// Answers cannot be edited by anyone
// Answers can only be deleted by a manager

// Get All Question Answers

router.get(
  "/:questionId",
  authMiddleware,
  //   isCreator,
  validateQAndAs,
  questionBelongsToSurvey,
  getQuestionAnswers
);

// Get All Survey Answers

router.get("/", authMiddleware, getSurveyAnswers);

// Unregistered User Answers

router.post("/:questionId", validateQAndAs, questionBelongsToSurvey, newAnswer);

// Registered User Answers

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
