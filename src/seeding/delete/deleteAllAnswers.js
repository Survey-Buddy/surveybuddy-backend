const mongoose = require("mongoose");
const { Answer } = require("../../models/answersModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    // Connect to database using the URI env variables
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database.");

    // Delete all entries from the Answer collection
    const result = await Answer.deleteMany({});
    console.log(`${result.deletedCount} answers deleted.`);

    // Disconnect from database after completion
    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    // Handle errors
    console.error("Error deleting answers:", error);
  }
})();
