require("dotenv").config()
const express=require("express")
const authRoutes=require("./routes/auth.route")
const connectDB=require("./config/db")


const app=express();
const PORT=process.env.PORT || 5001
connectDB()

app.use(express.json())


app.get("/",(req,res)=>{
  res.send("Hello World")
})

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})