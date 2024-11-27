const { Survey } = require("../models/surveyModel");
const { User } = require("../models/userModel");

exports.newSurvey = async (request, response) => {
  const { name, questionCount } = request.body;
  console.log(name, questionCount);
  console.log(request.user.userId);
  try {
    const userId = request.user?.userId;
    if (!userId || !name || !questionCount) {
      return response.status(400).json({
        success: false,
        message: "Missing a required field.",
      });
    }

    const author = await User.findById(userId);
    if (!author) {
      return response.status(404).json({
        success: false,
        message: "User not found. Cannot create survey.",
      });
    }

    const newSurvey = new Survey({
      name,
      author: userId,
      questionCount,
    });
    await newSurvey.save();

    return response.status(201).json({
      success: true,
      message: "Survey created succssfully.",
      survey: newSurvey,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editSurvey = async (request, response) => {
  try {
    // Survey edit logic here
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteSurvey = async (request, response) => {
  try {
    // Survey deletion logic here
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
