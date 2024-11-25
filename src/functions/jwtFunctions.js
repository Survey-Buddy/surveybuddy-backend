const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

// Function to generate a JWT

function generateNewToken(userId, username) {
  if (!userId || !username) {
    throw new Error("UserId or Username is missing."); // Throw new error because not directly tied to a HTTP request / response cycle
  }

  try {
    token = jwt.sign(
      {
        userId: userId,
        username: username,
      },
      jwtSecretKey,
      {
        expiresIn: "7d", // Expires in 7 days
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating new JWT:", error);
    throw new Error("Failed to generate token.");
  }
}

// Function to decode JWT

function decodeJWT(token) {
  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    console.log(decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT.");
    throw new Error("Invalid or expired JWT token.");
  }
}

// Function to validate JWT

async function validateUserToken(request, response, next) {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return response.status(403).json({
        message: "Sign in to view this content.",
      });
    }

    // Add decoded data to request object for use in subsequent middleware
    let decodedData = decodeJWT(token);

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
  validateUserToken,
};