const express=require("express")

const router=express.Router()

const {signupUser,loginUser,logoutUser,onboardUser}=require("../controllers/auth.controller")


const {protectRoute}=require("../middleware/auth.middleware")
const User = require("../models/User.model")

router.post("/signup",signupUser)


router.post("/login",loginUser)


router.post("/logout",logoutUser)


router.post("/onboarding",protectRoute,onboardUser)


router.get("/me",protectRoute,(req,res)=>{
  res.status(200).json({success:true,user:req.user})
})

module.exports=router