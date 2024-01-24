const express= require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/register",async (req,res)=>{
    try{

        const {name,email, mobile, password }= req.body;
        console.log("Received data:", { name, email, mobile, password });
        
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        
        //email user exist or not
        const isExistingUser = await  User.findOne({email});
        if (isExistingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
//mobile exist user or not
const mobileExistingUser = await  User.findOne({ mobile });
        if (mobileExistingUser) {
            return res.status(409).json({ message: "mobile User already exists" });
        }
        //password regarding parameter1 password another is salt(no of rounds salt);
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
});
//login

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                errorMessage: "Bad Request! Invalid credentials",
            });
        }

        const userDetails = await User.findOne({ email:email });
        
        

        if (!userDetails) {
            return res
                .status(401)
                .json({ errorMessage: "Invalid credentials" });
        }
//password compare matching
        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ errorMessage: "Invalid credentials" });
        }

        const token = await jwt.sign(
            { userId: userDetails._id },
            process.env.JWT_SECRET
        );

        res.json({
            message: "User logged in successfully",
            token: token,
            name: userDetails.name,
        
        });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
});

module.exports = router;