const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const userRoutes = require("./routes/userRoutes");
const { corsConfig, helmetConfig } = require("./services/securityServices");

// Initialise express app

const app = express();

// Configure Security Services Middleware

app.use(corsConfig());
app.use(helmetConfig());

// Middleware

app.use(express.json());

// Middleware Router Routes

app.use("/users", userRoutes);

// Test route

app.get("/", (request, response) => {
  response.json({
    message: "Hello SurveyBuddy!",
  });
});

module.exports = { app };
