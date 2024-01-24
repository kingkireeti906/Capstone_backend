const express= require('express');
const auth=require('./Routes/auth.js')
const job =require('./Routes/job.js')

//create a server
const app=express();
//env files access
const dotenv=require('dotenv');
dotenv.config()
const port=process.env.port

//Db connection
const Db= require('./config/./Db.js')
app.use(express.json());

//health api
app.get('/health',(req,res)=>{
    res.json({
       "service":"job listening server",
       "status":"Active",
       "time":new Date(),
    })
});
app.use("/api/v1/auth", auth);
app.use("/api/v1/job", job);
app.listen(port,(err)=>{

if(err)
console.log("something went wrng on port")
else
console.log(`'port is working ${port}`)
})