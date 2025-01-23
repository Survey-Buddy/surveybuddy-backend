const mongoose = require("mongoose");
const { User } = require("../../models/userModel");

require("dotenv").config();

const MONGO_URI = process.env.DATABASE_URL;

(async () => {
  try {
    // Connect to the database using the URI from env variables
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database.");

    // Delete all entries from the User collection
    const result = await User.deleteMany({});
    console.log(`${result.deletedCount} users deleted.`);

    // Disconnect from the database after completion
    await mongoose.disconnect();
    console.log("Disconnected from the database.");
  } catch (error) {
    // Handle errors
    console.error("Error deleting users:", error);
  }
})();
