const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define schema for answers
const answerSchema = new Schema({
  // Reference to question
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  // Time stamped (now)
  submitted: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Reference to user who submitted answer (optional)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // Answer (mixed - can be any data type)
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

// Create the Answer model using the schema
const Answer = mongoose.model("Answer", answerSchema);

module.exports = {
  Answer,
};
