// Check if decoded JWT userId matches the userId sent in params

exports.checkUserAuthorisaton = (request, response, next) => {
  // Extract userId from params
  const { userId } = request.params;

  if (!userId) {
    return response
      .status(400)
      .json({ message: "No userId passed in params." });
  }

  // UserId from decoded token
  const decodedUserId = request.user?.userId;
  if (!decodedUserId) {
    return response
      .status(400)
      .json({ message: "No valid user information found in the request." });
  }

  // Check if the two userIds match
  try {
    if (userId === decodedUserId) {
      console.log("Debug: Users matched!");
      next();
    } else {
      return response.status(403).json({
        message: "You are not authorised to access this resource.",
      });
    }
  } catch (error) {
    console.error("Error authorising user.", error);
    response.status(500).json({ message: "Internal server error." });
  }
};
