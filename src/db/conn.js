// const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/youtubeRegistration",{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("Connection Successfull!");
}).catch((err)=>{
    console.log(err);
    console.log("Connection to database failed");   
});