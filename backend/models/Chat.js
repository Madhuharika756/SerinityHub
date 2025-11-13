// models/chat.js
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  botReply: { type: String, required: true },
  moodBefore: { type: String, required: true },
  moodAfter: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;