const bcrypt = require("bcrypt");

// Service to hash a password

exports.hashPassword = async (password) => {
  // Ensure password exists
  if (!password) {
    throw new Error("Missing required field: password.");
  }
  try {
    // Number of salt rounds for bcrypt
    const saltRounds = 10;
    // Hash the password
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    // Handle errors
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed.");
  }
};

// Service to validate if entered password and hashed password match

exports.comparePasswords = async (password, hashedPassword) => {
  // Ensure both password and hashed passwords are provided
  if (!password || !hashedPassword) {
    throw new Error("Missing required fields: password or hashed password.");
  }
  try {
    // Compare passwords
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    // Handle errors
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed.");
  }
};
