const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

var currentUser = req.session.currentUser;

// sign up route
router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

// post signup route to DB

router.post("/user/signup", (req, res, next) => {
  console.log("we're in");
  const username = req.body.username;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    password: hash
  })
    .then(() => {
      console.log("SUCCESS!!!!");

      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

// login get route
router.get("/login", (req, res, next) => {
  res.render("user/login");
});

// LOGIN POST ROUTE
router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username })
    .then(userFromDB => {
      if (!userFromDB) {
        console.log("This user doesnt exist");
        res.redirect("/");
      }

      if (bcrypt.compareSync(password, userFromDB.password)) {
        currentUser = userFromDB;
        console.log(currentUser);
        res.redirect("/");
      }
      console.log(userFromDB);
    })
    .catch(err => {
      next(err);
    });
});

// logout POST route
router.post("/logout", (req, res, next) => {
  // literally destroys the session
  req.session.destroy();
  console.log("Session terminated");
  res.redirect("/login");
});

// User-only private page
router.get("/secret", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("user/secret", { theUser: currentUser });
  } else {
    res.redirect("/");
  }
});
module.exports = router;
