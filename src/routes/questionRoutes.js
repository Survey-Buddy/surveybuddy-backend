const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.post("/newQuestion", questionController.newQuestion);
router.patch("/editQuestion", questionController.editQuestion);
router.delete("/deleteQuestion", questionController.deleteQuestion);

module.exports = router;
