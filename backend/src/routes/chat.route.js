const express=require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const getStreamToken = require("../controllers/chat.controller");

const chatRouter=express.Router();

chatRouter.get("/token",protectRoute,getStreamToken)

module.exports=chatRouter