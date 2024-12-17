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
    required: false,
    minLength: [5, "Survey description must be at least 5 characters long."],
  },
  organisation: {
    type: String,
    required: false,
    minLength: [3, "Survey organisation must be at least 3 characters long."],
  },
  respondents: {
    type: String,
    required: false,
    default: "public",
    enum: ["public", "registered", "inviteOnly"],
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: ["work", "research", "school", "fun", "other"],
  },
  endDate: {
    type: String,
    default: () => {
      const currentDate = new Date();
      const oneYearFromCreate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
      return oneYearFromCreate.toISOString();
    },
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date().toISOString(),
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
