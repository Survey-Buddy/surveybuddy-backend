const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = new Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: [true, "Survey is  required."],
  },
  questionNum: {
    type: Number,
    required: [true, "Question number is required."],
    trim: true,
  },
  questionFormat: {
    type: String,
    enum: ["multiChoice", "rangeSlider", "writtenResponse"],
    default: "writtenResponse",
    required: [true, "Question format is required."],
  },
  question: {
    type: String,
    required: [true, "A question is required."],
    trim: true,
    minLength: [5, "Question must be at least 5 characters long."],
  },
  formatDetails: {
    type: Schema.Types.Mixed,
    default: {},
    validate: {
      validator: function (value) {
        if (this.questionFormat === "multiChoice") {
          return (
            value.answerA && value.answerB && value.answerC && value.answerD
          );
        }
        if (this.questionFormat === "rangeSlider") {
          return value.rangeDescription && typeof value.max === "number";
        }
        return true;
      },
      message: "Invalid formatDetails for the specified questionFormat.",
    },
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question,
};
