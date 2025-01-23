const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define the schema for questions
const questionSchema = new Schema({
  // Reference to parent survey
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: [true, "Survey is  required."],
  },
  // Question order number
  questionNum: {
    type: Number,
    required: [true, "Question number is required."],
    trim: true,
  },
  // Question foramt (multiple choice, range slider, or written response)
  questionFormat: {
    type: String,
    enum: ["multiChoice", "rangeSlider", "writtenResponse"],
    default: "writtenResponse",
    required: [true, "Question format is required."],
  },
  // Question text
  question: {
    type: String,
    required: [true, "A question is required."],
    trim: true,
    minLength: [5, "Question must be at least 5 characters long."],
  },
  // Additional details dependant of question format
  formatDetails: {
    type: Schema.Types.Mixed,
    default: {},
    validate: {
      // Different validation based on question foramt
      validator: function (value) {
        if (this.questionFormat === "multiChoice") {
          // Multi choice must have answers A - D
          return (
            value.answerA && value.answerB && value.answerC && value.answerD
          );
        }
        if (this.questionFormat === "rangeSlider") {
          // Range slider must have description and max value
          return value.rangeDescription && typeof value.max === "number";
        }
        // No validation for written response
        return true;
      },
      message: "Invalid formatDetails for the specified questionFormat.",
    },
  },
});

// Create the Question model using the schema
const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question,
};
