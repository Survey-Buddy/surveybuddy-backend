const jwt = require("jsonwebtoken");

// Get the jwt secret key from environemnt variablse
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// If no secret key, throw error
if (!jwtSecretKey) {
  throw new Error(
    "JWT secret key is not defined. Check environment variables."
  );
}

// Function to generate a new JWT
function generateNewToken(userId, username, email) {
  // Ensure required fields exist
  if (!userId || !username || !email) {
    console.error("Missing required fields for token generation.");
    throw new Error("Missing required fields for token generation.");
  }

  try {
    // Create and sign the jwt with 7 day exp
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

// Function to decode and verify JWT
function decodeJWT(token) {
  try {
    // Verify token using secret key
    const decodedToken = jwt.verify(token, jwtSecretKey);

    // Check if there are missing fields in the decoded token
    if (!decodedToken.userId || !decodedToken.username || !decodedToken.email) {
      throw new Error("Decoded token payload is missing required fields.");
    }

    return decodedToken;
  } catch (error) {
    // Handle errors
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

// Middleware to validate jwt for auth routes
async function authMiddleware(request, response, next) {
  try {
    // Get token from auth header
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided in the header.");
      return response.status(401).json({
        success: false,
        message: "Authorization token missing. Please sign in.",
      });
    }

    // Decode and verify the token
    const decodedData = decodeJWT(token);
    console.log("Decoded JWT data:", decodedData);

    // Attach decoded data to the request object
    request.user = decodedData;
    next();
  } catch (error) {
    // Handle errors
    console.error("JWT validation error:", error.message);

    // Handle expired errors
    if (error.message.includes("expired")) {
      return response.status(401).json({
        success: false,
        message: "JWT token has expired. Please sign in again.",
      });
    }

    // Handle invalid token errors
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
