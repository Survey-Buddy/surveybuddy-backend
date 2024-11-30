const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.time,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = {
  Answer,
};
