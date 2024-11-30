const bcrypt = require("bcrypt");

// Service to hash a password

exports.hashPassword = async (password) => {
  if (!password) {
    throw new Error("Missing required field: password.");
  }
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed.");
  }
};

// Service to validate if entered password and hashed password match

exports.comparePasswords = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new Error("Missing required fields: password or hashed password.");
  }
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed.");
  }
};
