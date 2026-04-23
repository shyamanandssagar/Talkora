import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use(protectRoute);

userRouter.get("/", getRecommendedUsers);
userRouter.get("/friends", getMyFriends);

userRouter.post("/friend-request/:id", sendFriendRequest);

userRouter.put("/friend-request/:id/accept", acceptFriendRequest);

userRouter.get("/friend-requests", getFriendRequests);

userRouter.get("/outgoing-friend-requests", getOutgoingFriendReqs);

userRouter.delete("/friend-request/:id/reject", rejectFriendRequest);

export default userRouter;