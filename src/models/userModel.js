const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define the structure of a User entry
const userSchema = new Schema({
  // User first name
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First name must be at least 3 characters long."],
  },
  // User last name
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First name must be at least 3 characters long."],
  },
  // User username
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Username must be at least 3 characters long."],
  },
  // User email
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please provide a valid email address."],
  },
  // User password
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [6, "Password must be at least 6 characters long."],
  },
});

// Create User model using schema
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
