const mongoose = require("mongoose");
const { Answer } = require("../../models/answersModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to the database.");
    const result = await Answer.deleteMany({});
    console.log(`${result.deletedCount} answers deleted.`);

    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    console.error("Error deleting answers:", error);
  }
})();
