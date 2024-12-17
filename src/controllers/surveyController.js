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

    const formattedSurveys = userSurveys.map((survey) => ({
      ...survey.toObject(),
      date: survey.date.toISOString(),
      endDate: survey.date.toISOString() || "",
    }));

    return response.status(200).json({
      success: true,
      data: formattedSurveys,
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
    return response.status(400).json({
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
    console.error("Error fetching specific survey.", error);
    return response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Create New Survey

exports.newSurvey = async (request, response) => {
  const {
    name,
    description,
    respondents,
    purpose,
    active,
    organisation,
    endDate,
  } = request.body;

  try {
    const userId = request.user?.userId;
    if (!userId || !name || !description) {
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
      active,
      description,
      respondents,
      purpose,
      organisation,
      userId: userId,
      // If undefined it defaults to schema default + 1yr
      endDate: endDate || undefined,
    });
    await newSurvey.save();

    console.log(newSurvey);

    // Respond to client
    return response.status(201).json({
      success: true,
      message: "Survey created succssfully.",
      name: newSurvey.name,
      active: newSurvey.active,
      description: newSurvey.description,
      respondents: newSurvey.respondents,
      purpose: newSurvey.purpose,
      organisation: newSurvey.organisation,
      userId: newSurvey.userId,
      endDate: newSurvey.endDate,
      date: new Date().toISOString(),
      _id: newSurvey._id,
    });
  } catch (error) {
    console.error("Error creating new survey", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit Survey (PATCH)

exports.editSurvey = async (request, response) => {
  const { name, description, organisation, purpose, endDate } = request.body;
  const { surveyId } = request.params;

  if (!surveyId) {
    return response.status(400).json({
      success: false,
      message: "Missing a required field: surveyId.",
    });
  }

  if (!name && !description) {
    return response.status(400).json({
      success: false,
      message: "No new survey data to update.",
    });
  }

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (description) fieldsToUpdate.description = description;
  if (organisation) fieldsToUpdate.organisation = organisation;
  if (endDate) fieldsToUpdate.endDate = endDate;
  if (purpose) fieldsToUpdate.purpose = purpose;

  // If no fields to update
  if (Object.keys(fieldsToUpdate).length === 0) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: name.",
    });
  }

  try {
    // Update survey
    const updatedSurvey = await Survey.findByIdAndUpdate(
      surveyId,
      // Only include truthy values in update
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(organisation && { organisation }),
        ...(purpose && { purpose }),
        ...(endDate && { endDate }),
      },
      // Enforce schema validation rules (minLength etc)
      { new: true, runValidators: true }
    );

    if (!updatedSurvey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
    }

    // Respond to client
    return response.status(200).json({
      success: true,
      message: "Survey successfully updated.",
      updatedSurvey,
    });
  } catch (error) {
    console.error("Error updating survey:", error);
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
    console.error("Error deleting survey:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
