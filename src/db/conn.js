// const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_name,{
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