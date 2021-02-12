require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const path = require("path");
const hbs = require("hbs");
const router = require("./routers/router");
const port = process.env.PORT || 8000;

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(staticPath));
// app.use(express.static(path.join(__dirname, '../public')));
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);
app.use(router);

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}!`);
});