const { mongoose } = require("mongoose");

exports.checkIsValidObjectId = async (id) => {
  if (!id) {
    throw new Error(`Missing required field: ${id}.`);
    return false;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`${id} is not a valid mongoose object.`);
    return false;
  }

  return true;
};
