"use strict";
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/postgres");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Find or create the user in your database
        let user = await User.findOne({ where: { google_id: profile.id } });
        if (!user) {
          user = await User.create({
            google_id: profile.id,
            display_name: profile.displayName,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            profile_image: profile.photos[0].value,
          });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Google Login Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

// Router if something went wrong
router.get("/login-failure", (req, res) => {
  res.send("Something went wrong....");
});

// Persist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Retrieve user data from session.
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = router;
