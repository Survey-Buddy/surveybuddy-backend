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
    required: [true, "Survey number is required."],
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
  rangeDescription: {
    type: String,
    enum: ["no", "notAtAll", "disagree"],
    default: "notAtAll",
    trim: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question,
};
