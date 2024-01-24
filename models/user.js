const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const user= mongoose.model("User", userSchema);

module.exports = user;