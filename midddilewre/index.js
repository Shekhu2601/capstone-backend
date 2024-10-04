
const express=require('express')
const app = express();
const dotenv =require("dotenv")

dotenv.config()
const fs =require("fs")

 const IncomingRequestLodder   =( (req, res, next)=>{
   
    fs.appendFileSync("./log.txt", `${req.method}  ${req.url} ${new Date().toISOString()}\n`)
    next()
})
module.exports =IncomingRequestLodder;