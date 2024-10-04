const express=require('express')
const mongoose= require('mongoose')
const app = express();
const dotenv =require("dotenv")
const IncomingRequestLodder =require("./midddilewre/index")
const userRouter= require("./routes/user")
const indexRouter =require("./routes/index");
const bodyParser = require('body-parser');
const JobRouter=require("./routes/job")

dotenv.config()
const cors=require("cors")
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(IncomingRequestLodder)
app.use("/api/v1", indexRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/job", JobRouter)




app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port 4000")
    mongoose.connect(process.env.MONGOOSE_URI_STRING,{

    })
    mongoose.connection.on("error", (err)=>{
        console.log(err)
    })
    
})