const express= require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/",async (req,res)=>{
    try{
        const {name,email, mobile, password }= req.body;
        console.log("Received data:", { name, email, mobile, password });
        
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        
        
        //email user exist or not
        const isExistingUser = await  User.findOne({ email:email});
        if (isExistingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
//mobile exist user or not
const mobileExistingUser = await  User.findOne({ mobile:mobile });
        if (mobileExistingUser) {
            return res.status(409).json({ message: "mobile User already exists" });
        }
        //password regarding
        const hashedPassword = await bcrypt.hash(password, 10);
//db store

const userData = new User({
    name,
    email,
    mobile,
    password: hashedPassword,
});

const userResponse = await userData.save();
//token genreation
const token = await jwt.sign(
    { userId: userResponse._id },
    process.env.JWT_SECRET
);
//final mesagge in this route
res.json({
    message: "User registered successfully",
    token: token,
    name: name,
    password: hashedPassword,
});
console.log("ok");
    }
    catch(err)
    {
        console.log(err)
    }
})

module.exports = router;