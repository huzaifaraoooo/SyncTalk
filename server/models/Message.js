const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    roomId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    time: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

module.exports = Message;