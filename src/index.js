const { app } = require("./server");
const { dbConnect } = require("./functions/dbFunctions");

// Use port found in .env or 3000

const PORT = process.env.PORT || 3000;

// Connect to server

app.listen(PORT, async () => {
  await dbConnect();
  console.log("Server is running on port:" + PORT);
});
