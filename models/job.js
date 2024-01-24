const mongoose = require("mongoose");
//scheme create
const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    logoUrl: {
        type: String,
        required: true,
    },
    refUserId: {
        type: mongoose.Types.ObjectId,
      
        required: true,
    },
});
//model create
const job = mongoose.model("Job", jobSchema);
module.exports = job;
// module.exports=mongoose.model("job",jobschema)   