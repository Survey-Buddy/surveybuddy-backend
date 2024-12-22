const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error(
    "JWT secret key is not defined. Check environment variables."
  );
}

// Function to generate a new JWT
function generateNewToken(userId, username, email) {
  if (!userId || !username || !email) {
    console.error("Missing required fields for token generation.");
    throw new Error("Missing required fields for token generation.");
  }

  try {
    const token = jwt.sign(
      {
        userId,
        username,
        email,
      },
      jwtSecretKey,
      {
        expiresIn: "7d",
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error.message);
    throw new Error("Failed to generate token.");
  }
}

// Function to decode JWT
function decodeJWT(token) {
  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);

    if (!decodedToken.userId || !decodedToken.username || !decodedToken.email) {
      throw new Error("Decoded token payload is missing required fields.");
    }

    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT:", error.message);
    if (error.name === "TokenExpiredError") {
      throw new Error("JWT token has expired.");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid JWT token.");
    } else {
      throw new Error("An error occurred while decoding the token.");
    }
  }
}

// Middleware to validate JWT
async function authMiddleware(request, response, next) {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided in the header.");
      return response.status(401).json({
        success: false,
        message: "Authorization token missing. Please sign in.",
      });
    }

    const decodedData = decodeJWT(token); // Decode and verify the token
    console.log("Decoded JWT data:", decodedData);

    request.user = decodedData; // Attach decoded data to the request object
    next();
  } catch (error) {
    console.error("JWT validation error:", error.message);

    if (error.message.includes("expired")) {
      return response.status(401).json({
        success: false,
        message: "JWT token has expired. Please sign in again.",
      });
    }

    return response.status(403).json({
      success: false,
      message: "Invalid token. Please sign in to access this resource.",
    });
  }
}

module.exports = {
  generateNewToken,
  decodeJWT,
  authMiddleware,
};
