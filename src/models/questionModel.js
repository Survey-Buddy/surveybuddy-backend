const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = new Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: [true, "Survey is  required."],
  },
  questionNumber: {
    type: Number,
    required: [true, "Survey number is required."],
    trim: true,
  },
  questionFormat: {
    type: String,
    enum: ["multiChoice", "range", "writtenResponse"],
    required: [true, "Question format is required."],
  },
  question: {
    type: String,
    required: [true, "A question is required."],
    trim: true,
  },
  answer: {
    type: String,
    trim: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question,
};
