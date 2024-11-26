const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");

const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

// Load environment variables

// const jwtSecretKey = process.env.JWT_SECRET_KEY;
// console.log(jwtSecretKey);

// if (!jwtSecretKey) {
//   console.error("JWT_SECRET_KEY is missing in the environment variables.");
//   process.exit(1); // Exit if the secret key is not found
// }

// Initialise express app

const app = express();

// Configure Helmet server security

try {
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
      },
    })
  );
} catch (error) {
  console.error("Helmet config error:", error);
}

// CORS (Cross-Origin Resource Sharing)
// Only allow certain urls access to server

let corsOptions = {
  origin: [
    "http://localhost:3000", // Backend Local
    "http://localhost:5173", // Client Local
    "http://127.0.0.1:5173", // Client Local
    "https://deployedreactapp.com", // Deployed App
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

// Middleware Router Routes

app.use("/users", userRoutes);

// Test route

app.get("/", (request, response) => {
  response.json({
    message: "Hello SurveyBuddy!",
  });
});

module.exports = { app };
