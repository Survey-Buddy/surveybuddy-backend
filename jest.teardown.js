const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.disconnect(); // Ensure all connections are closed
  console.log("Disconnected from MongoDB");
  process.exit(0); // Force Jest to exit after teardown
};
