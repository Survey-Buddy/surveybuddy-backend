const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/signupLoginController");
const { editUser, deleteUser } = require("../controllers/userController");
const newUserValidation = require("../services/newUserValidation");

// SignupLogin controller router routes

// Route for user signup with validation
router.post("/signup", newUserValidation, signup);

// Route for user login
router.post("/login", login);

// User controller router routes

// ** Future features

// router.patch("/editUser", editUser);
// router.delete("/deleteUser", deleteUser);

module.exports = router;
