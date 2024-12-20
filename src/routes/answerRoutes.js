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

// prefix: '/answers'

// Answers Router Paths
// Answers cannot be edited by anyone
// Answers cannot be deleted

// Get All Question Answers

router.get(
  "/:surveyId/:questionId",
  authMiddleware,
  //   isCreator,
  // validateQAndAs,
  // questionBelongsToSurvey,
  getQuestionAnswers
);

// Get All Survey Answers

router.get("/:surveyId", authMiddleware, getSurveyAnswers);

// New Unregistered Answer

router.post("/:surveyId/:questionId", validateAnswer, newAnswer);

// Registered User Answers

// router.post(
//   "/:surveyId/:questionNum",
//   authMiddleware,
//   validateQAndAs,
//   questionBelongsToSurvey,
//   newRegisteredAnswer
// );

// Route for tracked survey results - only one set of answers per assigned respondent
// router.post("/newTrackedAnswer/:userId", checkUser, answerController.newTrackedAnswer)

module.exports = router;
