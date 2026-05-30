import { upsertStreamUser } from "../config/stream.js";
import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../config/nodemailer.js";
import crypto from "crypto";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const issueToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export const signupUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${fullName}`;

    const user = await User.create({
      fullName,
      email,
      password,
      profilePic: avatar,
      isEmailVerified: false,
    });

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic || undefined,
      });
    } catch (error) {
      console.error("Error creating Stream user:", error);
    }

    try {
      const otp = generateOTP();
      await OTP.deleteMany({ email, purpose: "verify_email" });
      await OTP.create({ email, otp, purpose: "verify_email" });
      await sendOTPEmail({
        to: email,
        subject: "Verify your Talkora email",
        otp,
        purpose: "verify",
      });
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Account created. Please verify your email with the OTP sent.",
      email,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((v) => v.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const record = await OTP.findOne({ email, purpose: "verify_email" });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one.",
      });
    }

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: record._id });

    const user = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    issueToken(res, user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email already verified" });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: "verify_email" });
    await OTP.create({ email, otp, purpose: "verify_email" });
    await sendOTPEmail({
      to: email,
      subject: "Verify your Talkora email",
      otp,
      purpose: "verify",
    });

    res.status(200).json({ success: true, message: "OTP resent to your email" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google sign-in. Please use Continue with Google.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      const otp = generateOTP();
      await OTP.deleteMany({ email, purpose: "verify_email" });
      await OTP.create({ email, otp, purpose: "verify_email" });
      await sendOTPEmail({
        to: email,
        subject: "Verify your Talkora email",
        otp,
        purpose: "verify",
      });

      return res.status(403).json({
        success: false,
        message: "Email not verified. A new OTP has been sent to your email.",
        redirectTo: "verify_email",
        email,
      });
    }

    issueToken(res, user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Logout failed", error: error.message });
  }
};

export const onboardUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } =
      req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, nativeLanguage, learningLanguage, location, profilePic, isOnboarded: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({
      success: true,
      message: "Onboarding complete",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    issueToken(res, user._id);

    const frontendURL =
      process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:5173";

    if (!user.isOnboarded) {
      return res.redirect(`${frontendURL}/onboarding`);
    }

    return res.redirect(`${frontendURL}/`);
  } catch (error) {
    res.redirect(
      `${process.env.NODE_ENV === "production" ? "" : "http://localhost:5173"}/login?error=google_failed`
    );
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: "forgot_password" });
    await OTP.create({ email, otp, purpose: "forgot_password" });
    await sendOTPEmail({
      to: email,
      subject: "Reset your Talkora password",
      otp,
      purpose: "reset",
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const record = await OTP.findOne({ email, purpose: "forgot_password" });

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not found or expired" });
    }

    if (record.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      });
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    record.otp = resetToken;
    record.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await record.save();

    res.status(200).json({
      success: true,
      message: "OTP verified",
      resetToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const record = await OTP.findOne({ email, purpose: "forgot_password" });

    if (!record || record.otp !== resetToken || record.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ _id: record._id });

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((v) => v.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};