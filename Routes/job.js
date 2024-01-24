const express=require('express');
const router=express.Router()
const Job=require('../models/job');
const verifyjwt=(require('../middlewares/verifytoken'))

router.post('/create' ,verifyjwt,async(req,res)=>{
    try {
        const {   companyName,title,logoUrl, description}=req.body;
        if(!companyName||!title||!logoUrl|| !description)
         return res.status(400).json({
            errorMessage: "Bad Request",
        });
        const existingJobDetails = await Job.findOne({
            companyName,
            title,
            logoUrl,
            description,
            refUserId:req.body.userId
        });

        if (existingJobDetails) {
            return res.json({ message: "Same details already in the database" });
        }
    
       const  jobDetails = new Job({
            companyName,
            logoUrl,
            title,
            description,
            refUserId: req.body.userId, 
        });
      

        await jobDetails.save();
        res.json({ message: "New job created successfully" });
}
catch (error) {
        console.log(error)
    }
})
module.exports = router;