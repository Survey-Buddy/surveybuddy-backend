const mongoose = require("mongoose");
const { Question } = require("../../models/questionModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    // Connect to the database using the URI env variables
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database.");

    // Delete all the entries from the Question collection
    const result = await Question.deleteMany({});
    console.log(`${result.deletedCount} questions deleted.`);

    // Disconnection from database after completion
    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    // Handle errors
    console.error("Error deleting questions:", error);
  }
})();
