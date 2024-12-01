const { Survey } = require("../models/surveyModel");
const { User } = require("../models/userModel");

// Get all specific user surveys

exports.getAllSurveys = async (request, response) => {
  const decodedUserId = request.user?.userId;

  if (!decodedUserId) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: userId.",
    });
  }

  try {
    const userSurveys = await Survey.find({ userId: decodedUserId });

    if (userSurveys.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No surveys found for this user.",
      });
    }

    return response.status(200).json({
      success: true,
      data: userSurveys,
    });
  } catch (error) {
    console.error("Error fetching user surveys:", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get a specific survey

exports.getSpecificSurvey = async (request, response) => {
  const { surveyId } = request.params;

  if (!surveyId) {
    return response.status(404).json({
      success: false,
      message: "Missing required field: surveyId.",
    });
  }

  try {
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return response.status(404).json({
        success: false,
        message: "No survey with that Id found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: survey,
    });
  } catch (error) {
    console.error("Error fetching specific survey.");
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Create New Survey

exports.newSurvey = async (request, response) => {
  const { name } = request.body;

  try {
    const userId = request.user?.userId;
    if (!userId || !name) {
      return response.status(400).json({
        success: false,
        message: "Missing a required field.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found. Cannot create survey.",
      });
    }

    // Create and save new Survey
    const newSurvey = new Survey({
      name,
      userId: userId,
      date: new Date(),
    });
    await newSurvey.save();

    // Respond to client
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
  const { name } = request.body;
  const { surveyId } = request.params;

  if (!surveyId || !name) {
    return response.status(401).json({
      success: false,
      message: "Missing a required field",
    });
  }

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;

  // If no fields to update
  if (Object.keys(fieldsToUpdate) === 0) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: name.",
    });
  }

  try {
    // Update survey
    const updatedSurvey = await Survey.findByIdAndUpdate(
      surveyId,
      fieldsToUpdate,
      { new: true }
    );

    // Respond to client
    return response.status(200).json({
      success: true,
      message: "Survey successfully updated.",
      updatedSurvey,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Survey Path (DELETE)

exports.deleteSurvey = async (request, response) => {
  const { surveyId } = request.params;

  if (!surveyId) {
    return response.status(404).json({
      success: false,
      message: "Missing required field missing to delete survey.",
    });
  }

  try {
    // Delete survey
    const surveyToDelete = await Survey.findByIdAndDelete(surveyId);
    if (!surveyToDelete) {
      return response.status(400).json({
        success: false,
        message: "Survey not found.",
      });
    }

    // Respond to client
    return response.status(201).json({
      success: true,
      message: "Survey deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
