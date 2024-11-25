const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the structure of a User entry
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  organisation: {
    type: String,
  },
  // References the Roles model
  roles: [{ type: Schema.Types.ObjectId, ref: "Roles" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
