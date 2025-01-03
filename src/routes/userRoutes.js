const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/signupLoginController");
const { editUser, deleteUser } = require("../controllers/userController");
const newUserValidation = require("../services/newUserValidation");

// Signup Login Router Routes
// Prefix http://localhost:8080/users

router.post("/signup", newUserValidation, signup);
router.post("/login", login);

// User Router Routes

router.patch("/editUser", editUser);
router.delete("/deleteUser", deleteUser);

module.exports = router;
