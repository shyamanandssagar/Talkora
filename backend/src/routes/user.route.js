const express=require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const { getRecommendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest,rejectFriendRequest,getFriendRequests,getOutgoingFriendReqs } = require("../controllers/user.controller");

const userRouter=express.Router();

//apply auth middleware to all routes
userRouter.use(protectRoute)

userRouter.get("/",getRecommendedUsers)
userRouter.get("/friends",getMyFriends)


userRouter.post("/friend-request/:id",sendFriendRequest)


userRouter.put("/friend-request/:id/accept",acceptFriendRequest)


userRouter.get("/friend-requests",getFriendRequests)


userRouter.get("/outgoing-friend-requests",getOutgoingFriendReqs)

userRouter.delete("/friend-request/:id/reject", rejectFriendRequest);


module.exports=userRouter;