const { Question } = require("../models/questionModel");
const { Survey } = require("../models/surveyModel");

// isCreator middleware

exports.isCreator = (model, fieldName) => {
  return async (request, response, next) => {
    const { [fieldName]: id } = request.params;
    const decodedUserId = request.user?.userId;

    // Ensure that both the ID and the decoded user ID are in request
    if (!id || !decodedUserId) {
      return response.status(400).json({
        success: false,
        message: `Missing required fields: ${fieldName} or decodedUserId.`,
      });
    }

    try {
      console.log("Id is:", id);

      // Check if the resource exists
      let resource = await model.findById(id);

      if (model === Question) {
        resource = await Survey.findById(resource.surveyId);
      }

      if (!resource) {
        return response.status(404).json({
          success: false,
          message: `${fieldName} not found.`,
        });
      }

      console.log("Resource = ", resource);

      // Check if the user is the creator of the resource
      if (resource.userId.toString() !== decodedUserId) {
        return response.status(403).json({
          success: false,
          message: `You are not the creator of this ${fieldName}.`,
        });
      }

      // Proceed to next middleware if the user is the creator
      next();
    } catch (error) {
      // Handle any errors that occur during the check
      console.error(`Error checking ownership of ${fieldName}:`, error);
      return response.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
};

// exports.isCreator = async (model, fieldName) => {
//   return async (request, response, next) => {
//     const { [fieldName]: id } = request.params;
//     const decodedUserId = request.user?.userId;

//     console.log("Middleware params:", { id, decodedUserId });

//     // Check if request includes required fields
//     if (!id || !decodedUserId) {
//       return response.status(400).json({
//         success: false,
//         message: `Missing required fields: ${fieldName} or decodedUserId.`,
//       });
//     }
//     try {
//       // Check if User is creator
//       const resource = await model.findById(id);

//       if (!resource) {
//         return response.status(404).json({
//           success: false,
//           message: `${fieldName} not found.`,
//         });
//       }

//       if (resource.userId.toString() !== decodedUserId) {
//         return response.status(403).json({
//           success: false,
//           message: `You are not the creator of this ${fieldName}.`,
//         });
//       }
//       console.log("User is creator, proceeding to next.");
//       // User is creator
//       next();
//     } catch (error) {
//       console.error(`Error checking ownership of ${fieldName}.`, error);
//       return response.status(500).json({
//         success: false,
//         message: "Internal server error.",
//       });
//     }
//   };
// };

// Service to validate if User is a manager

exports.validateIsManager = async (request, response, next) => {};
