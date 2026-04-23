const { upsertStreamUser } = require("../config/stream");
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
    const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${fullName}`;
    
    const user = await User.create({
      fullName,
      email,
      password,
      profilePic:avatar
    });



    //creating a user in GetStream
    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic || undefined,
      });

      console.log(` Stream user created: ${user.fullName}`);

    } catch (error) {
      console.error(" Error creating Stream user:", error);
      throw error; 
    }



    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    res.cookie("token", token, {
      httpOnly: true,        
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",    
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

   
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic:avatar
      }
    });

  } catch (error) {

  //  HANDLE MONGOOSE VALIDATION ERROR
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(
      (val) => val.message
    );

    return res.status(400).json({
      success: false,
      message: messages[0], // show first error
    });
  }

  //  HANDLE DUPLICATE EMAIL
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  
  res.status(500).json({
    success: false,
    message: "Server error",
  });
}
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }


    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

   
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic:user.profilePic
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



const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
};



const onboardUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      profilePic 
    } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean) 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        profilePic, 
        isOnboarded: true
      },
      {
        new: true,           
        runValidators: true  
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });

      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }

    res.status(200).json({
      success: true,
      message: "Onboarding data received",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports={signupUser,loginUser,logoutUser,onboardUser}