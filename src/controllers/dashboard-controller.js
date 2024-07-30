"use strict";
const { Note, User, sequelize } = require("../models/postgres");
const { Op } = require("sequelize");

/**
 * GET /
 * Dashboard
 */
exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    const user_id = req.user.id;

    const { count, rows: notes } = await Note.findAndCountAll({
      where: { user_id },
      order: [["updated_at", "DESC"]],
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      res.send("Something went wrong.");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * PUT /
 * Update Specific Note
 */
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.update(
      {
        title: req.body.title,
        body: req.body.body,
        updatedAt: sequelize.fn("NOW"),
      },
      { where: { id: req.params.id, user_id: req.user.id } }
    );
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    await Note.create({
      title: req.body.title,
      body: req.body.body,
      user_id: req.user.id,
      created_at: sequelize.fn("NOW"),
      updated_at: sequelize.fn("NOW"),
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Search
 */
exports.dashboardSearch = (req, res) => {
  res.render("dashboard/search", {
    searchResults: "",
    layout: "../views/layouts/dashboard",
  });
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    // const searchTerm = req.body.searchTerm;
    // const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    // const searchResults = await Note.findAll({
    //   where: {
    //     user_id: req.user.id,
    //     [Op.or]: [
    //       { title: { [Op.iLike]: `%${searchNoSpecialChars}%` } },
    //       { body: { [Op.iLike]: `%${searchNoSpecialChars}%` } },
    //     ],
    //   },
    //   order: [["updated_at", "DESC"]],
    // });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};
