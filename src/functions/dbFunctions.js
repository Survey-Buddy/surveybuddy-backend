const mongoose = require("mongoose");

// Connect to DataBase
// If NODE_ENV ='s test, connect to local test database
// If not, connect to DATABASE_URL in .env or local package name

async function dbConnect() {
  const databaseURL =
    process.env.NODE_ENV === "test"
      ? "mongodb://127.0.0.1:27017/surveybuddy-test"
      : process.env.DATABASE_URL ||
        `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
  try {
    await mongoose.connect(databaseURL);
    console.log(`Connected to database successfully: ${databaseURL}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process on failure
  }
}

module.exports = { dbConnect };
