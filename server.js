"use strict";
require("dotenv").config();
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template Engines
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use("/", require("./src/routes/index"));

app.use("*", (req, res) => {
  // res.status(404).send("404 Page is not found");
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
