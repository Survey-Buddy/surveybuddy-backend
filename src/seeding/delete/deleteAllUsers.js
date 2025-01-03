const mongoose = require("mongoose");
const { User } = require("../../models/userModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to the database.");
    const result = await User.deleteMany({});
    console.log(`${result.deletedCount} users deleted.`);

    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
})();
