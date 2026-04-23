const mongoose=require("mongoose")
const bcrypt = require("bcryptjs");


const userSchema=new mongoose.Schema({
  fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      trim:true,
      validate: {
        validator: function (value) {
          // At least 1 uppercase, 1 lowercase, 1 number, 1 special char
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(value);
        },
        message:
          "Password must contain uppercase, lowercase, number, and special character"
      },
      select:false
    },

    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"]
    },

    profilePic: {
      type: String,
      default: "" 
    },

    nativeLanguage: {
      type: String,
      default: ""
    },

    learningLanguage: {
    type: String,
    default: "",
    },
    
    location: {
      type: String,
      default: ""
    },

    isOnboarded: {
      type: Boolean,
      default: false
    },
    friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
    ]
},{timestamps:true});


userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

  } catch (error) {
    throw error; 
  }
});



userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User=mongoose.model("User",userSchema);

module.exports=User