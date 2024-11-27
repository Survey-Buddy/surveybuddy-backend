const { Survey } = require("../models/surveyModel");
const { User } = require("../models/userModel");

// Create New Survey (POST)

exports.newSurvey = async (request, response) => {
  const { name, questionCount } = request.body;

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

// Edit Survey (PATCH)

exports.editSurvey = async (request, response) => {
  try {
    // Survey edit logic here
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Survey (DELETE)

exports.deleteSurvey = async (request, response) => {
  const { surveyId } = request.body;
  try {
    const surveyToDelete = await Survey.findById(surveyId);
    if (!surveyToDelete) {
      response.status(400).json({
        success: false,
        message: "Survey not found.",
      });
    }

    await Survey.findByIdAndDelete(surveyToDelete);

    return response.status(201).json({
      success: true,
      message: "Survey deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
