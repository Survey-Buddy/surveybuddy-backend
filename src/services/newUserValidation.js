const newUserValidation = (request, response, next) => {
  const { email, password, firstName, lastName, username } = request.body;

  // Validate email format
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  if (!firstName || !lastName || !username || !email || !password) {
    return response.status(400).json({
      success: false,
      message: "Missing a required field.",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  }

  // Proceed to next
  next();
};

module.exports = newUserValidation;
