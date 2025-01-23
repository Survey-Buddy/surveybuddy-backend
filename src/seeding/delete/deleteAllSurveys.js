const mongoose = require("mongoose");
const { Survey } = require("../../models/surveyModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    // Connect to the database using the URI from env variables
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database.");

    // Delete all entries from the Survey collection
    const result = await Survey.deleteMany({});
    console.log(`${result.deletedCount} surveys deleted.`);

    // Disconnect from the database after completion
    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    // Handle errors
    console.error("Error deleting surveys:", error);
  }
})();
