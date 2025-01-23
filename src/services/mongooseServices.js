const { mongoose } = require("mongoose");

// Check if passed Id is a valid mongoose ObjectId

exports.checkIsValidObjectId = async (id) => {
  // Check if required fields (id) exist
  if (!id) {
    throw new Error(`Missing required field: ${id}.`);
    return false;
  }

  // Check if id is a valid mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`${id} is not a valid mongoose object.`);
    return false;
  }

  // If id is valid, return true
  return true;
};
