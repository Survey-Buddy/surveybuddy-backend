const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/signupLoginController");
const { editUser, deleteUser } = require("../controllers/userController");

// Signup Login Router Routes

router.post("/signup", signup);
router.post("/login", login);

// User Router Routes

router.patch("/editUser", editUser);
router.delete("/deleteUser", deleteUser);

module.exports = router;
