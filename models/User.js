const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["manager", "employee"],
      default: "employee",
      required: true,
    },
    task: { type: mongoose.SchemaTypes.ObjectId, ref: "Task" },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
