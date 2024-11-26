const helmet = require("helmet");
const cors = require("cors");

// Configure Helmet server security

const helmetConfig = () => {
  try {
    return [
      helmet.permittedCrossDomainPolicies(),
      helmet.referrerPolicy(),
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
        },
      }),
    ];
  } catch (error) {
    console.error("Helmet config error:", error);
    return [];
  }
};

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

const corsConfig = () => cors(corsOptions);

module.exports = {
  corsConfig,
  helmetConfig,
};
