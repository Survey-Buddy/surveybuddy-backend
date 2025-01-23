const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define the survey schema
const surveySchema = new Schema({
  // Title of survey
  name: {
    type: String,
    required: [true, "Survey title is required"],
    minLength: [5, "Survey title must be at least 5 characters long."],
  },
  // Survey description
  description: {
    type: String,
    required: false,
    minLength: [5, "Survey description must be at least 5 characters long."],
  },
  // Organisation associated with survey (optional)
  organisation: {
    type: String,
    minLength: [3, "Survey organisation must be at least 3 characters long."],
  },
  // Who can response to survey (optional)
  respondents: {
    type: String,
    default: "public",
    enum: ["public", "registered", "inviteOnly"],
  },
  // If the survey is active or not
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  // Purpose of the surevey (optional)
  purpose: {
    type: String,
    enum: ["work", "research", "school", "fun", "other"],
  },
  // Survey end date (default 1 year from creation)
  endDate: {
    type: String,
    // Returning as ISO string to fix client TS errors
    default: () => {
      const currentDate = new Date();
      const oneYearFromCreate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
      return oneYearFromCreate.toISOString();
    },
    required: true,
  },
  // Creation date of survey
  date: {
    // Returning as ISO string to fix client TS errors
    type: Date,
    default: () => new Date().toISOString(),
    required: true,
  },
  // User who created survey (ref User)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is  required"],
  },
});

// Create the Survey model using the schema
const Survey = mongoose.model("Survey", surveySchema);

module.exports = {
  Survey,
};
