import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { isAdmin } from "../middleware/admin.js";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  getMessagesBetweenUsers,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", protectRoute, isAdmin, getAllUsers);
router.post("/block/:userId", protectRoute, isAdmin, blockUser);
router.post("/unblock/:userId", protectRoute, isAdmin, unblockUser);
router.get("/messages/:user1Id/:user2Id", protectRoute, isAdmin, getMessagesBetweenUsers);

export default router;