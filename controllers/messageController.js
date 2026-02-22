const Message = require("../models/Message");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message
    });

    res.json(newMessage);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get conversation
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user._id }
      ]
    }).sort("timestamp");

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};