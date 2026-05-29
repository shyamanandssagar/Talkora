import express from "express";
import passport from "../config/passport.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  onboardUser,
  googleCallback,
  verifyEmailOTP,
  resendEmailOTP,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//  Standard Auth 
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/onboarding", protectRoute, onboardUser);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

//  Email Verification 
router.post("/verify-email", verifyEmailOTP);
router.post("/resend-email-otp", resendEmailOTP);

//  Forgot / Reset Password 
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);

//  Google OAuth 
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      process.env.NODE_ENV === "production"
        ? "/login?error=google_failed"
        : "http://localhost:5173/login?error=google_failed",
    session: false,
  }),
  googleCallback
);

export default router;
