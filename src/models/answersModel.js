const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  submitted: {
    type: Date,
    default: Date.now,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: "Unregistered user",
    required: false,
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
