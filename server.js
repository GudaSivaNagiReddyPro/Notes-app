"use strict";
const path = require("path");
require("dotenv").config();
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");

const app = express();
const port = process.env.PORT;

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template Engines
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use("/", require("./src/routes/auth"));
app.use("/", require("./src/routes/index"));
app.use("/", require("./src/routes/dashboard"));

app.use("*", (req, res) => {
  // res.status(404).send("404 Page is not found");
  res.render("404");
});

app.listen(port, () => {
  try {
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
