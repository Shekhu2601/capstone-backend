const express=require('express')
const mongoose= require('mongoose')
const router = express.Router()
const dotenv =require("dotenv")
dotenv.config()
const bcrypt =require('bcrypt')
const bodyParser= require('body-parser')
const jsonwebtoken =require("jsonwebtoken")
const User =require("../schema/user.schema")
// ragistation user
router.post(("/ragister"), async(req ,res)=>{
    const {name, email,mobile, password} =req.body;
    const ifuserExist = await User.findOne({email}) //user is exists
    if(ifuserExist){
        return res.status(400).json({message: "User already exists"})
    }
    
    const hashpassword= await bcrypt.hash(password, 10)
    const user = new User( { name,email , mobile,password:hashpassword})
    await user.save()
    res.status(200).json({message:"User craete succesfully "})
})
// Get all users
router.get(("/") , async(req, res)=>{
    const users = await User.find().select("-password")
    res.status(200).json(users)
})
//find by email
router.get("/:email",async(req, res)=>{
    const {email}=req.params;
    const user =await User.findOne({email})
    if (!user){
        return res.status(404).json({message:"User Not Found"})
    }
    res.status(200).json(user)
})
// login user
router.post("/login", async(req,res)=>{
    const {email, password} =req.body;
    const user = await User.findOne({email}) //user is exists
    if(!user){
        return res.status(400).json({message: "Wrong email "})
    }
    const isPassMatch= await bcrypt.compare(password, user.password)
    if(!isPassMatch){
        return res.status(400).json({message: "Wrong password "})
    }
    const payload ={id:user._id}
    const token =jsonwebtoken.sign(payload ,process.env.JWT_SECRET)
    
     res.json({message:"user logged in",email:email,
        token
     })
     
})


module.exports=router;