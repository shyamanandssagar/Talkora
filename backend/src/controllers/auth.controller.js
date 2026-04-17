const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    
    const user = await User.create({
      fullName,
      email,
      password
    });

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,        // 🔒 prevents XSS
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "Strict",    // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 6. Send response (avoid sending password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = signupUser;
const loginUser=async (req,res)=>{
  res.send("login controller")
}

const logoutUser=async (req,res)=>{
  res.send("logout controller")
}


module.exports={signupUser,loginUser,logoutUser}