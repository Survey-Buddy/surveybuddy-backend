const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = {
  Answer,
};
