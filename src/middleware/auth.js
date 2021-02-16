const express = require("express");
const router = new express.Router();
const Register = require("../models/registers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser  = require("cookie-parser");

const auth = async (req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Register.findOne({_id: verifyUser._id});

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        // res.status(401).send(error);
        res.status(200).render("loginToContinue");
    }
}

module.exports = auth;