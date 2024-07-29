const express = require("express");
const router = express.Router();
const mainController = require("../controllers/main-controller");

router.get("/", mainController.homePage);
router.get("/about", mainController.aboutPage);

module.exports = router;
