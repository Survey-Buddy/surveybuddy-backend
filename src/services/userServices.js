const User = require("../models/userModel");

// Check if email already exists
async function checkExistingEmail(email) {
  return await User.findOne({ email });
}

// Check if username already exists
async function checkExistingUsername(username) {
  return await User.findOne({ username });
}

module.exports = {
  checkExistingEmail,
  checkExistingUsername,
};
