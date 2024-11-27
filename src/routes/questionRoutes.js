const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { validateQAndAs } = require("../services/questionAnswerServices");
const { authMiddleware } = require("../functions/jwtFunctions");

router.post(
  "/newQuestion/:userId",
  authMiddleware,
  validateQAndAs,
  questionController.newQuestion
);
router.patch(
  "/editQuestion:userId",
  authMiddleware,
  questionController.editQuestion
);
router.delete(
  "/deleteQuestion/:userId",
  authMiddleware,
  questionController.deleteQuestion
);

module.exports = router;
