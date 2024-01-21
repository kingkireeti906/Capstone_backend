const mongoose = require("mongoose");
const Db=mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Db connected!"))
    .catch((error) => console.log("Failed to connect", error));
module.exports=Db;
