const mongoose = require("mongoose");
const { Survey } = require("../../models/surveyModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to the database.");
    const result = await Survey.deleteMany({});
    console.log(`${result.deletedCount} surveys deleted.`);

    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    console.error("Error deleting surveys:", error);
  }
})();
