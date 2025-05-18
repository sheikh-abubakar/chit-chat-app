import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // Exclude the admin user (the one making the request)
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const blockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { isBlocked: true }, { new: true });
  res.json(user);
};

export const unblockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { isBlocked: false }, { new: true });
  res.json(user);
};

export const getMessagesBetweenUsers = async (req, res) => {
  const { user1Id, user2Id } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id },
    ],
  });
  res.json(messages);
};