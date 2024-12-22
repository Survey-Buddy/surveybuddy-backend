const mongoose = require("mongoose");
const { Question } = require("../../models/questionModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to the database.");
    const result = await Question.deleteMany({});
    console.log(`${result.deletedCount} questions deleted.`);

    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    console.error("Error deleting questions:", error);
  }
})();
