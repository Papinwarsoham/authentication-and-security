//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/UserDB");
const UserSchema = new mongoose.Schema({
  email: "String",
  password: "String",
});
// var secret = "This is a secrect message";
console.log(process.env.SECRET);
UserSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});
const User = mongoose.model("user", UserSchema);

app.get("/home", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const user = new User({
    email: username,
    password: password,
  });
  user
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }).then((data) => {
    if (data.password === password) {
      res.render("secrets");
    } else {
      res.redirect("login");
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
