require("dotenv").config()
const express=require("express")

const cookieParser = require("cookie-parser");

const cors=require("cors");

const authRoutes=require("./routes/auth.route")
const userRoutes=require("./routes/user.route")
const chatRoutes=require("./routes/chat.route")
const connectDB=require("./config/db")


const app=express();
const PORT=process.env.PORT || 5001
connectDB()


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);




app.use(express.json())

app.use(cookieParser());


app.get("/",(req,res)=>{
  res.send("Hello World")
})

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})