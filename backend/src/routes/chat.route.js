import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import getStreamToken from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/token", protectRoute, getStreamToken);

export default chatRouter;