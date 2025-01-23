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

    // Hash the password for security
    const hashedPassword = await hashPassword(password);

    // Create new User and save to the database
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate a token for the new user
    const token = generateNewToken(
      newUser._id,
      newUser.username,
      newUser.email
    );

    console.log("New user registered successfully");

    // Respond with success and token
    return response.status(201).json({
      success: true,
      message: "User created successfully.",
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      token: token,
    });
  } catch (error) {
    // Handle unexpected errors
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
  // Extract email and password from request body
  const { email, password } = request.body;

  try {
    // Ensure email and password are provided
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if the email exists in the database
    const user = await User.findOne({ email }).select(
      "password _id username email"
    );
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Verify the provided password matches the stored password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return response.status(400).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Generate a token for the user
    const token = generateNewToken(user._id, user.username, user.email);

    console.log("User logged in successfully");

    // Respond with success and user details
    return response.status(200).json({
      success: true,
      userId: user._id,
      username: user.username,
      token: token,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error logging in:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
