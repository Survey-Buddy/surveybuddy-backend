// New User details validation

export const newUserValidation = (request, response, next) => {
  const { email, password, firstName, lastName, username } = request.body;

  // Check if the email is a valid email format
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  // Ensure all required fields are provided in request body
  if (!firstName || !lastName || !username || !email || !password) {
    return response.status(400).json({
      success: false,
      message: "Missing a required field.",
    });
  }

  // Validate if password meets mimimum length requirements
  if (password.length < 6) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  }

  // If all validations pass, proceed to next middleware
  next();
};
