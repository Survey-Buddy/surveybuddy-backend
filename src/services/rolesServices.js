const { Question } = require("../models/questionModel");
const { Survey } = require("../models/surveyModel");

// Check if user is creator of field name

exports.isCreator = async (model, fieldName) => {
  return async (request, response, next) => {
    const { [fieldName]: id } = request.params;
    const decodedUserId = request.user?.userId;

    // Check if request includes required fields
    if (!id || !decodedUserId) {
      return response.status(400).json({
        success: false,
        message: `Missing required fields: ${fieldName} or decodedUserId.`,
      });
    }

    try {
      // Check if User is creator
      const resource = await model.findById(id);
      if (resource.userId.toString() !== decodedUserId) {
        return response.status(403).json({
          success: false,
          message: `You are not the creator of this ${fieldName}.`,
        });
      }

      // User is creator
      return next();
    } catch (error) {
      console.error(`Error checking ownership of ${fieldName}.`, error);
      return response.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
};

// Service to validate if User is a manager

exports.validateIsManager = async (request, response, next) => {};
