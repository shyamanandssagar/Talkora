const { generateStreamToken } = require("../config/stream")

const getStreamToken=async (req,res)=>{
  try{
    const token=generateStreamToken(req.user._id);
    res.status(200).json({token});
  }catch(error){
    console.log("Error in getStreamToken controller:",error.message);
    res.status(500).json({message:"Internal Server Error"})
  }
}


module.exports=getStreamToken