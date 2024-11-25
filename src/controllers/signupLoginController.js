const { generateNewToken } = require("../functions/jwtFunctions");
const { hashPassword } = require("../services/passwordServices");
const {
  checkExistingEmail,
  checkExistingUsername,
} = require("../services/userService");
const User = require("../models/userModel");

// Path to handle User Signup Registration

exports.signup = async (request, response) => {
  const { firstName, lastName, username, email, password } = request.body;

  try {
    // Check if email already exists
    const existingEmail = await checkExistingEmail(email);
    if (existingEmail) {
      return response.status(400).json({
        message: "Email already in use.",
      });
    }

    // Check if username already exists
    const existingUsername = await checkExistingUsername(username);
    if (existingUsername) {
      return response.status(400).json({
        message: "Username already in use.",
      });
    }

    // Hash the password with X rounds of salt
    const hashedPassword = await hashPassword(password);

    // Create variable and save new User to DB
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create JWT to send in response
    let token;
    try {
      token = generateNewToken(newUser._id, newUser.username, newUser.email);
    } catch (error) {
      console.error("Error generating JWT:", error);
      return response.status(500).json({
        success: false,
        message: "Failed to generate token.",
      });
    }

    // Respond to client
    return response.status(201).json({
      success: true,
      massage: "User created and stored successfully.",
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
