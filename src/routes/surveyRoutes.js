const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");

router.post("/newSurvey", surveyController.newSurvey);
router.patch("/editSurvey", surveyController.editSurvey);
router.delete("/deleteSurvey", surveyController.deleteSurvey);

module.exports = router;
