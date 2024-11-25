const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

// Initialise express app
const app = express();

// CORS (Cross-Origin Resource Sharing)
// Only allow certain urls access to server

let corsOptions = {
  origin: [
    "http://localhost:3000", // Backend Local
    "http://localhost:5173", // Client Local
    "http://127.0.0.1:5173", // Client Local
    "https://deployedreactapp.com", // Deployed App
  ],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

// Test route

app.get("/", (request, response) => {
  response.json({
    message: "Hello SurveyBuddy!",
  });
});

module.exports = { app };
