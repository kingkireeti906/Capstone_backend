const express= require('express');
//create a server
const app=express();
//env files access
const dotenv=require('dotenv');
dotenv.config()
const port=process.env.port
//health api
app.get('/health',(req,res)=>{
    res.json({
       "service":"job listening server",
       "status":"Active",
       "time":new Date(),
    })
});

app.listen(port,(err)=>{

if(err)
{
    console.log("something went wrng on port")
}
else
{
console.log(`'port is working ${port}`)
}
}
)