const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define the structure of a User entry
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "First name must be at least 3 characters long."],
  },
  lastName: {
    type: String,
    // required: true,
    trim: true,
    minLength: [3, "Last name must be at least 3 characters long."],
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Username must be at least 3 characters long."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [6, "Password must be at least 6 characters long."],
  },
  organisation: {
    type: String,
    trim: true,
  },
  // References the Roles model
  //   roles: [{ type: Schema.Types.ObjectId, ref: "Roles" }],
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
