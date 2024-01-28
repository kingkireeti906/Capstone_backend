const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const verifyjwt = require("../middlewares/verifytoken");

router.post("/create", verifyjwt, async (req, res) => {
  try {
      const { companyName, title, logoUrl, description, skills } = req.body;
      if (!companyName || !title || !logoUrl || !description || !skills) {
          return res.status(400).json({
              errorMessage: "Bad Request",
          });
      }

      // Split the skills string into an array
      const skillsArray = skills?.split(',');

      const existingJobDetails = await Job.findOne({
          companyName,
          title,
          logoUrl,
          description,
          refUserId: req.body.userId,
          skills: { $all: skillsArray }, // Check if all skills in the array match
      });

      if (existingJobDetails) {
          return res.json({ message: "Same details already in the database" });
      }

      const jobDetails = new Job({
          companyName,
          logoUrl,
          title,
          description,
          refUserId: req.body.userId,
          skills: skillsArray, // Assign the skills array
      });

      await jobDetails.save();
      res.json({ message: "New job created successfully" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

router.put("/edit/:userid", verifyjwt, async (req, res) => {
  try {
    const { companyName, title, logoUrl, description } = req.body;
    const userid = req.params.userid;
    if (!companyName || !title || !logoUrl || !description || !userid)
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    const existingJobDetails = await Job.findOne({
      companyName,
      title,
      logoUrl,
      description,
      refUserId: req.body.userId,
    });

    if (existingJobDetails) {
      return res.json({ message: "Same data already in the database" });
    }
    await Job.updateOne(
      { _id: userid },
      {
        $set: {
          companyName,
          title,
          logoUrl,
          description,
          refUserId: req.body.userId,
        },
      }
    );
    res.json({ message: "New data updated successfully" });
  } catch (error) {
    console.log(error);
  }
});
router.get("/job-description/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        errorMessage: "Bad Request",
      });
    }

    const jobDetails = await Job.findById(jobId);

    res.json({ data: jobDetails });
  } catch (error) {
    console.log(error);
  }     
});
router.get("/all", async (req, res) => {
  try {
    const query = req.query.title || "";

    let skilled = req.query.skills;
    
    let filterSkills = skilled?.split(",");
    console.log(filterSkills);  
    let filter={}
    
    if(filterSkills)
     filter = { skills: { $in: [...filterSkills] } };
    // const query2=req.query.companyName;

    // const data= await Job.find({},{
    //     title:1
    // })

    //regex uses sequential words enter in the parameters now it gives all sequtial data
    const data = await Job.find(
      { title: { $regex: query, $options: "i" },
  
      ...filter,
        },
      { companyName: 1, title: 1 }
    );
    // const data1= await Job.find({companyName:{$regex:q   uery2,$options: 'i'}},{companyName:1,title:1})

    return res.json({ data: data });
  } catch (error) {
    console.log(error);
  }
});
router.delete("/job/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const title = req.query.title || "";
    const jobList = await Job.deleteById(jobId);

    // add filter in the find query with skills
    // ["html", "css", "js"] this is how skill should be saved in the database document

    res.json({ data: jobList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
