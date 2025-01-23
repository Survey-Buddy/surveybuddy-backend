const mongoose = require("mongoose");

// Connect to DataBase
// If NODE_ENV ='s test, connect to local test database
// If not, connect to DATABASE_URL in .env or local package name

// Function to connect to database
async function dbConnect() {
  // Determine which database URL will be used dependant on environment
  const databaseURL =
    process.env.NODE_ENV === "test"
      ? "mongodb://127.0.0.1:27017/surveybuddy-test"
      : process.env.DATABASE_URL ||
        `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
  try {
    // Attempt to connect to the database
    await mongoose.connect(databaseURL);
    console.log(`Connected to database successfully: ${databaseURL}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Exit the process on failure
    process.exit(1);
  }
}

module.exports = { dbConnect };
