const { User } = require("../models/userModel");

// Check if email already exists
exports.checkExistingEmail = async (email) => {
  console.log(User);
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Database email lookup failed.");
  }
};

// Check if username already exists
exports.checkExistingUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error("Error checking username existence:", error);
    throw new Error("Database username lookup failed");
  }
};
