const express = require("express");
const router = new express.Router();
const Register = require("../models/registers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser  = require("cookie-parser");
const auth = require("../middleware/auth");

router.get("/", (req, res)=>{
    try {
        //const data = await MensRanking.find().sort({"ranking":1});
        res.render("index"); // since view engine of hbs is used it will go to views->index.hbs
    } catch (error) {
        res.send(error);
    }
});

router.get("/login", (req, res)=>{
    try {
        //const data = await MensRanking.find().sort({"ranking":1});
        //res.render("login"); // since view engine of hbs is used it will go to views->login.hbs
        if(req.cookies.jwt === undefined)
            res.status(200).render("login");
        else{
            res.status(200).showAlert('Already loggedin!');
            // res.status(200).render("photos");
        }
    } catch (error) {
        res.send(error);
    }
});

// router.post("/login", async (req, res)=>{
//     try {
//         const email = req.body.email;
//         const password = req.body.password;
//         const userEmail = await Register.findOne({email: email});
//         const isMatched = await bcrypt.compare(password, userEmail.password);
//         console.log(isMatched);
//         if(isMatched){
//             res.status(200).render("home"); 
//         }
//         else{
//             res.status(400).send("Incorrect email or password.");
//         }
//         //const data = await MensRanking.find().sort({"ranking":1});
//         // since view engine of hbs is used it will go to views->login.hbs
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

router.get("/register", (req, res)=>{
    try {
        //const data = await MensRanking.find().sort({"ranking":1});
        res.render("register"); // since view engine of hbs is used it will go to views->login.hbs
    } catch (error) {
        res.send(error);
    }
});

router.get("/home", auth, (req, res)=>{
    try {
        //if(req.cookies.jwt === undefined)
        //    res.status(200).render("login");
        //else{
            res.status(200).render("home");
            // res.status(200).render("photos");
        //}
    } catch (error) {
        res.send(error);
    }
});

router.post("/home", async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({email: email});
        const isMatched = await bcrypt.compare(password, userEmail.password);
        const token = await userEmail.generateAuthToken();
        //res.cookie() function is used to set the cookie name and value.
        //The value parameter may be a string or object converted to json.
        //3rd parameter can be the {expires: new Date(Date.now() + 3000), httpOnly: true} to expire token in 3 seconds
        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 300000), 
        //     httpOnly: true
        //     //secure: true // when we use https instead of http
        // });
        if(req.cookies.jwt === undefined){
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000), 
                httpOnly: true
                //secure: true // when we use https instead of http
            });
        }
        if(isMatched){
            res.status(200).render("home"); 
        }
        else{
            res.status(400).send("Incorrect email or password.");
        }
        //const data = await MensRanking.find().sort({"ranking":1});
        // since view engine of hbs is used it will go to views->login.hbs
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/registrationSuccessful", (req, res)=>{
    try {
        // const data = await MensRanking.find().sort({"ranking":1});
        // res.send(data);
        res.status(200).send("Successfully registered!");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/photos", auth, (req, res)=>{
    try {
        // const data = await MensRanking.find().sort({"ranking":1});
        // res.send(data);
        // console.log(req.cookies.jwt);
        // if(req.cookies.jwt !== undefined)
            res.status(200).render("photos");
        // else{
        //     res.status(200).render("login");
        // }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/register", async (req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            });
            //middleware
            const token = await registerEmployee.generateAuthToken();
            //res.cookie() function is used to set the cookie name and value.
            //The value parameter may be a string or object converted to json.
            //3rd parameter can be the {expires: new Date(Date.now() + 3000), httpOnly: true} to expire token in 3 seconds
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000), 
                httpOnly: true
            });
            const registered = await registerEmployee.save();
            res.status(201).render("registrationSuccessful");
        }
        else{
            res.send("Passwords do not match");
        }
        // console.log(req.body.firstname);
        // res.send(req.body.firstname);
        // const data = await MensRanking.find().sort({"ranking":1});
        // res.send(data);
        // res.status(200).send("Successfully registered!");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/contactUs", (req, res)=>{
    try {
        // const data = await MensRanking.find().sort({"ranking":1});
        // res.send(data);
        res.status(200).render("contactUs");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/logout", auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currentToken)=>{
            return currentToken.token !== req.token;
        });
        res.clearCookie("jwt");
        console.log("logged out successfully");
        await req.user.save();
        res.status(200).render("login");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/logoutAllDevices", auth, async (req, res)=>{
    try {
        req.user.tokens = [];
        res.clearCookie("jwt");
        console.log("logged out successfully");
        await req.user.save();
        res.status(200).render("login");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("*", (req, res)=>{
    try {
        // const data = await MensRanking.find().sort({"ranking":1});
        // res.send(data);
        res.status(404).send("Requested page does not exist.");
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;