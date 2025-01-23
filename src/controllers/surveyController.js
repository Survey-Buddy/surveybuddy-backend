const { Survey } = require("../models/surveyModel");
const { User } = require("../models/userModel");

// Get all specific user surveys

exports.getAllSurveys = async (request, response) => {
  const decodedUserId = request.user?.userId;

  // Check if userId exists in the request
  if (!decodedUserId) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: userId.",
    });
  }

  try {
    // Fetch surveys for specific user
    const userSurveys = await Survey.find({ userId: decodedUserId });

    // Check if any surveys exist
    if (userSurveys.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No surveys found for this user.",
      });
    }

    // Format dates to ISO strings for front end
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

  // Check if surveyId exists
  if (!surveyId) {
    return response.status(400).json({
      success: false,
      message: "Missing required field: surveyId.",
    });
  }

  try {
    // Fetch survey by id
    const survey = await Survey.findById(surveyId);

    // Check if survey exists
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

    // Check if required fields exist
    if (!userId || !name || !description) {
      return response.status(400).json({
        success: false,
        message: "Missing a required field.",
      });
    }

    // Verify user exists
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
      // Default for front end TS error fix
      endDate: endDate || undefined,
    });
    await newSurvey.save();

    // Respond to client with survey details
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

// Edit existing survey

exports.editSurvey = async (request, response) => {
  const { name, description, organisation, purpose, endDate, userId } =
    request.body;
  const { surveyId } = request.params;

  // Check if surveyId is provided
  if (!surveyId) {
    return response.status(400).json({
      success: false,
      message: "Missing a required field: surveyId.",
    });
  }

  // Cannot update restricted fields
  if (userId) {
    return response.status(400).json({
      success: false,
      message: "Cannot update this field.",
    });
  }

  // Check if there are any fields to update
  if (!name && !description && !organisation && !purpose && !endDate) {
    return response.status(400).json({
      success: false,
      message: "No new survey data to update.",
    });
  }

  // Add fields to update to hashmap
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
    // Update survey with provided fields
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
      // Schema validation rules still apply
      { new: true, runValidators: true }
    );

    // Check if survey exists
    if (!updatedSurvey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found.",
      });
    }

    // Respond to client with update survey details
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

// Delete a survey

exports.deleteSurvey = async (request, response) => {
  const { surveyId } = request.params;

  // Check if surveyId is provided
  if (!surveyId) {
    return response.status(404).json({
      success: false,
      message: "Missing required field missing to delete survey.",
    });
  }

  try {
    // Delete survey by its id
    const surveyToDelete = await Survey.findByIdAndDelete(surveyId);

    // Check if survey exists
    if (!surveyToDelete) {
      return response.status(400).json({
        success: false,
        message: "Survey not found.",
      });
    }

    // Respond to client with success message
    return response.status(201).json({
      success: true,
      message: "Survey deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting survey:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
