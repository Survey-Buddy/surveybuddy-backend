const mongoose = require("mongoose");

const { Schema } = mongoose;

const rolesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roles: {
    type: String,
    enum: ["admin", "manager", "CTO"],
    default: [],
    required: true,
  },
});

const Roles = mongoose.model("Roles", rolesSchema);

module.exports = {
  Roles,
};
