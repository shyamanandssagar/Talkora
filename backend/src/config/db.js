const mongoose=require("mongoose")

const connectDB=async ()=>{
  try{
     const connectionDB=await mongoose.connect(process.env.MONGO_URI)
     console.log(`MongoDB connected ${connectionDB.connection.host}`)
  }catch(err){
    console.log(`Error connecting to MongoDB ${err}`);
    process.exit(1);
  }
  
}

module.exports=connectDB;