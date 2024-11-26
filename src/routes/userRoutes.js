const express = require("express");
const router = express.Router();
const signupLoginController = require("../controllers/signupLoginController");
const userController = require("../controllers/userController");

// Signup Login Router Routes

router.post("/signup", signupLoginController.signup);
router.post("/login", signupLoginController.login);

// User Router Routes

router.patch("/editUser", userController.editUser);
router.delete("/deleteUser", userController.deleteUser);

module.exports = router;
