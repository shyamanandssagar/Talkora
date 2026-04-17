const signupUser=async (req,res)=>{
  res.send("SignUp controller")
}

const loginUser=async (req,res)=>{
  res.send("login controller")
}

const logoutUser=async (req,res)=>{
  res.send("logout controller")
}


module.exports={signupUser,loginUser,logoutUser}