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
const { validateAnswer } = require("../services/answerFormatting");
const validateObjectIdParams = require("../services/validateObjects");

// prefix: '/answers'

// Answers Router Paths
// Answers cannot be edited by anyone
// Answers cannot be deleted unless parent survey is deleted

// Get all answers for a specific question

router.get(
  "/:surveyId/:questionId",
  authMiddleware,
  validateObjectIdParams,
  getQuestionAnswers
);

// Get all answers for a specific survey

router.get(
  "/:surveyId",
  authMiddleware,
  validateObjectIdParams,
  getSurveyAnswers
);

// Submit a new answer from an unregistered user

router.post(
  "/:surveyId/:questionId",
  validateAnswer,
  validateObjectIdParams,
  newAnswer
);

// Submit a new answer from a registered user
// ** Future feature

// router.post(
//   "/:surveyId/:questionNum",
//   authMiddleware,
//   validateQAndAs,
//   questionBelongsToSurvey,
//   newRegisteredAnswer
// );

// Route for tracked survey results - only one set of answers per assigned respondent
// ** Future feature
// router.post("/newTrackedAnswer/:userId", checkUser, answerController.newTrackedAnswer)

module.exports = router;
