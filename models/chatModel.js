const mongoose = require("mongoose");

const messageSchemma = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messageText: String,
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});

messageSchemma.index({sender:1,receiver:1}, { unique: false});

module.exports = mongoose.model("Message", messageSchemma);
