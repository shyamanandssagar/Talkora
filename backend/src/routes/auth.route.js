const express=require("express")

const router=express.Router()

const {signupUser,loginUser,logoutUser}=require("../controllers/auth.controller")


router.get("/signup",signupUser)


router.get("/login",loginUser)


router.get("/logout",logoutUser)

module.exports=router