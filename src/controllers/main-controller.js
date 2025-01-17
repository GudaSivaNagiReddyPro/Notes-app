"use strict";

const homepage = async (req, res) => {
  console.log("This is home page");
  const locals = {
    title: "NodeJs Notes",
    description: "Free Notes App",
  };
  res.render("index", {
    locals,
    layouts: "../views/layouts/front-page.ejs",
  });
};

const about = async (req, res) => {
  try {
    console.log("This is about page");
    const locals = {
      title: "About-NodeJs Notes",
      description: "Free Notes App",
    };
    res.render("about", locals);
  } catch (error) {
    console.log(/error/, error);
  }
};

module.exports = { homepage, about };
