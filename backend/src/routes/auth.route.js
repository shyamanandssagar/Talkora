const express=require("express")

const router=express.Router()

const {signupUser,loginUser,logoutUser,onboardUser}=require("../controllers/auth.controller")


const {protectRoute}=require("../middleware/auth.middleware")

router.post("/signup",signupUser)


router.post("/login",loginUser)


router.post("/logout",logoutUser)


router.post("/onboarding",protectRoute,onboardUser)

module.exports=router