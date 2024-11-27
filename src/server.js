const express = require("express");
const dotenv = require("dotenv");
const { corsConfig, helmetConfig } = require("./services/securityServices");

// Configure process.env before router routes

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const questionRoutes = require("./routes/questionRoutes");

// Initialise express app

const app = express();

// Configure Security Services Middleware

app.use(corsConfig());
app.use(helmetConfig());

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Router Routes

app.use("/users", userRoutes);
app.use("/surveys", surveyRoutes);
app.use("/questions", questionRoutes);

// Test route

app.get("/", (request, response) => {
  response.json({
    message: "Hello SurveyBuddy!",
  });
});

module.exports = { app };
