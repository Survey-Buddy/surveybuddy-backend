const mongoose = require("mongoose");

const { Schema } = mongoose;

const surveySchema = new Schema({
  name: {
    type: String,
    required: [true, "Survey title is required"],
    minLength: [5, "Survey title must be at least 5 characters long."],
  },
  description: {
    type: String,
    required: true,
    minLength: [5, "Survey description must be at least 5 characters long."],
  },
  organisation: {
    type: String,
    required: false,
    minLength: [3, "Survey organisation must be at least 3 characters long."],
  },
  respondents: {
    type: String,
    required: true,
    enum: ["Work", "Research", "School", "Fun", "Other"],
  },
  purpose: {
    type: String,
    required: true,
    enum: ["Public", "Registered", "Invite Only"],
  },
  completionDate: {
    type: Date,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is  required"],
  },
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = {
  Survey,
};
