import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};