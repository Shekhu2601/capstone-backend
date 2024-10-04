const express=require('express')
const mongoose= require('mongoose')
const router = express.Router()

const authMiddleware =require("../midddilewre/auth")
const bodyParser= require('body-parser')

const User =require("../schema/user.schema")
const Job = require("../schema/job.schema")
const isAuth =require("../utils/index")
const { z } = require("zod");
const { validateRequest } = require('zod-express-middleware')
 


router.post("/create",authMiddleware, async(req, res)=>{
    try{
        const {companyName, logo ,position, salary, jobType, remote, location, description, about ,skills, information ,creator} =req.body;
        const user =req.user;
        const jobs= skills.split(",").map(skills=> skills.trim());
        const job = new Job({companyName, logo ,position, salary, jobType, remote, location, description, about, skills:jobs, information ,creator:user})
        await job.save()
        res.status(201).json({message:"Job create successfully"})
    }
    catch(error)
    
    { console.log(error)
        res.status(400).json({message:"Job not create"})

    }
})
router.get(("/") , async(req, res)=>{
    const isAuthenticated=isAuth(req)
    const job =isAuthenticated ?await Job.find(): await Job.find().select("-_id -creator -about -information")
    res.status(200).json(job)
})
// authenticed 
/*router.get(("/:id") , authMiddleware, async(req, res)=>{
    const id =req.params.id;
    const job =await Job.findById(id);
    if(!job){ return res.status(400).json({message:"job not found"})

    }
    res.status(200).json(job)
})*/

// delete jobs
router.delete("/:id", authMiddleware, async (req,res)=>{
    const id =req.params.id;
    const job =await Job.findById(id);
    if(!job){
        return res.status(400).json({message:"Job not found"})
    }
    if(job.creator.toString() !==req.user.toString()){
        return res.status(401).json({message:"You are not authorized to delete this job" })
    }
    await Job.findByIdAndDelete(id);
    res.status(200).json({message:"job delete successfully"});
})

router.put("/:id", authMiddleware, async(req, res)=>{
   try{
    const id = req.params.id;
    const {companyName, logo ,position, salary, jobType, remote, location, description, about ,skills, information ,creator} =req.body;
    let jobs= skills.split(",").map(skills=> skills.trim());
    let job =await Job.findById(id);
    if(!job){
        return res.status(400).json({message:"Job not found"})
    }
    if(job.creator.toString() !==req.user.toString()){
        return res.status(401).json({message:"You are not authorized to delete this job" })
    }
     job = await Job.findByIdAndUpdate(id,{companyName, logo ,position, salary, jobType, remote, location, description, about, skills:jobs, information },{new:true});
    
    res.status(201).json(job)
}
   
   catch(error){
    console.log(error)
    res.status(400).json({message:"Job not updated"})
   }
})
// TODO: add skills also
router.get("/search/:title", async (req, res) => {
    const { title } = req.params;
    const jobs = await Job.find({ companyName: new RegExp(title, "i") }).select("-_id -creator -about -information");
    res.status(200).json(jobs);
})
  
 router.get("/:id", validateRequest({
     params: z.object({
         id: z.string().uuid()
     }),
 }), authMiddleware, async (req, res) => {
     const { id } = req.params.id;
     const job = await Job.findById(id);
     if (!job) {
         return res.status(404).json({ message: "Job not found" });
     }
     res.status(200).json(job);

    
     
 }
 );
module.exports =router;