const { generateNewToken } = require("../functions/jwtFunctions");
const {
  hashPassword,
  comparePasswords,
} = require("../services/passwordServices");
const {
  checkExistingEmail,
  checkExistingUsername,
} = require("../services/userServices");
const { User } = require("../models/userModel");

// Path to handle User Signup Registration
// POST - /users/signup

exports.signup = async (request, response) => {
  const { firstName, lastName, username, email, password } = request.body;

  try {
    if (!firstName || !lastName || !username || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "Missing a required field.",
      });
    }

    // Check if email already exists
    const existingEmail = await checkExistingEmail(email);
    if (existingEmail) {
      return response.status(400).json({
        success: false,
        message: "Email already in use.",
      });
    }

    // Check if username already exists
    const existingUsername = await checkExistingUsername(username);
    if (existingUsername) {
      return response.status(400).json({
        success: false,
        message: "Username already in use.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new User and save to DB
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate new token
    const token = generateNewToken(
      newUser._id,
      newUser.username,
      newUser.email
    );

    console.log("New user registered successfully");

    // Respond to client
    return response.status(201).json({
      success: true,
      message: "User created successfully.",
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      token: token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Login path
// POST - /users/login

exports.login = async (request, response) => {
  // Get username and password from request
  const { email, password } = request.body;

  // Check if email and password exist
  try {
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    // Check if email exists in the DB
    const user = await User.findOne({ email }).select(
      "password _id username email"
    );
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Check if user password matches entered password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return response.status(400).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Generate new token
    const token = generateNewToken(user._id, user.username, user.email);

    console.log("User logged in successfully");

    return response.status(200).json({
      success: true,
      userId: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      token: token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
