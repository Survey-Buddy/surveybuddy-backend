const { generateNewToken } = require("../functions/jwtFunctions");
const { hashPassword } = require("../services/passwordServices");
const {
  checkExistingEmail,
  checkExistingUsername,
} = require("../services/userServices");
const User = require("../models/userModel");

// Path to handle User Signup Registration

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

    // Create variable and save new User to DB
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
    // await newUser.save();

    console.log("Before Save:", newUser);
    const savedUser = await newUser.save();
    console.log("Saved User:", savedUser);

    console.log(newUser._id);

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    console.log("Process.env in controller:" + jwtSecretKey);

    // Generate token
    const token = generateNewToken(
      newUser._id,
      newUser.username,
      newUser.email
    );

    console.log("New User ID:", savedUser._id);

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

exports.login = async (request, response) => {};
