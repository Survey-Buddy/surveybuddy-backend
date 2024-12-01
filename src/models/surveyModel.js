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
  //   questionCount: {
  //     type: Number,
  //     required: [
  //       true,
  //       "Survey must have a specific number of questions on submit.",
  //     ],
  //     min: [1, "Survey must have at least 1 question."],
  //   },
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = {
  Survey,
};
