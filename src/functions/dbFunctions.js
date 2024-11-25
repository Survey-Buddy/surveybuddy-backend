const mongoose = require("mongoose");

// Connect to DB

async function dbConnect() {
  let databaseURL =
    process.env.DATABASE_URL ||
    `mongodb://127.0.0.1:27017/${process.env.npm_package_name}`;
  await mongoose
    .connect(databaseURL)
    .then(console.log("Connected to database successfully!"))
    .catch((error) => console.error("Mongo DB connection error: ", error));
}

module.exports = { dbConnect };
