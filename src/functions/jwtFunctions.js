const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error(
    "JWT secret key is not defined. Check environment variables."
  );
}

// Function to generate a new JWT

function generateNewToken(userId, username, email, firstName, lastName) {
  if (!userId || !username || !email || !firstName || !lastName) {
    throw new Error("Missing required fields for token generation.");
  }

  try {
    const token = jwt.sign(
      {
        userId,
        username,
        email,
        firstName,
        lastName,
      },
      jwtSecretKey,
      {
        expiresIn: "7d",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Failed to generate token.");
  }
}

// Function to decode JWT

function decodeJWT(token) {
  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);

    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT.");
    throw new Error("Invalid or expired JWT token.");
  }
}

// Function to validate JWT

// async function authMiddleware(request, response, next) {
//   next();
// }

async function authMiddleware(request, response, next) {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided in the header.");
      return response.status(403).json({
        message: "Sign in to view this content.",
      });
    }

    // Add decoded data to request object for use in subsequent middleware
    const decodedData = decodeJWT(token);
    console.log("Decoded JWT data:", decodedData);

    request.user = decodedData;

    next();
  } catch (error) {
    console.error("JWT validation error:", error);
    return response.status(403).json({
      message: "Sign in to view this content.",
    });
  }
}

module.exports = {
  generateNewToken,
  decodeJWT,
  authMiddleware,
};
