const express = require("express");
const router = express.Router();
const userController = require("../controllers/signupLoginController");
// User Router Routes

router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
