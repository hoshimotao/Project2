const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const Feed = require("../models/Feed");
const bcrypt = require("bcryptjs");
const uploadCloud = require("../config/cloudinary.js");

// SIGN UP GET ROUTE
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// SIGNUP POST ROUTE TO DB
router.post("/signup", (req, res, next) => {
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
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

// LOGIN POST ROUTE
// router.post("/login", (req, res, next) => {
//   let username = req.body.username;
//   let password = req.body.password;
//   User.findOne({ username: username })
//     .then(userFromDB => {
//       if (!userFromDB) {
//         res.redirect("/");
//       }
//       if (bcrypt.compareSync(password, userFromDB.password)) {
//         req.user = userFromDB;
//         res.redirect("/user/profile");
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// }); 

router.post("/login", passport.authenticate("local", {
  successRedirect: "/user/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// lOGOUT POST ROUTE
router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

// CREATE POST IMAGE POST REQUEST
router.post(
  "/user/profile/image",
  uploadCloud.single("photo"),
  (req, res, next) => {
    User.findByIdAndUpdate(
      req.user,
      {
        picture: req.file.url
      },
      { new: true }
    )
      .then(result => {        
        req.user = result;
        res.redirect("/user/profile");
      })
      .catch(err => next(err));
  }
);

// CREATE POST PHRASE POST REQUEST
router.post("/user/profile/feed", (req, res, next) => {
  Feed.create({
    caption: req.body.feed,
    author: req.user._id
  })
    .then(result => {
      res.redirect("/user/profile");
    })
    .catch(err => next(err));
});

// DELETE FEED
router.post("/user/profile/delete/:id", (req, res, next) => {
  let id = req.params.id;
  Feed.findByIdAndRemove(id)
    .then(result => {
      res.redirect("/user/profile");
    })
    .catch(err => {
      next(err);
    });
});

// EDIT FEED GET REQUEST
router.get("/user/edit/:id", (req, res, next) => {
  let id = req.params.id;

  Feed.findByIdAndUpdate(id)

    .then(result => {

      res.render("user/edit", { thisPost: result });
    })
    .catch(err => {
      next(err);
    });
});

// EDIT FEED POST REQUEST
router.post("/user/edit/:id", (req, res, next) => {
  let id = req.params.id;
  Feed.findByIdAndUpdate(id, req.body)
    .then(result => {
      res.redirect("/user/profile");
    })
    .catch(err => {
      next(err);
    });
});

// UPDATE USER GET REQUEST
router.get("/user/update/:id", (req, res, next) => {
  let id = req.params.id;
  const user = req.user;
  res.render("user/update", { theUser: user });
});

// UPDATE USERNAME AND PICTURE POST REQUEST
router.post("/user/update/:id", (req, res, next) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { username: req.body.username })
    .then(result => {
      res.redirect("/user/profile");
    })
    .catch(err => {
      next(err);
    });
});

// DISPLAY FEED GET REQUEST
router.get("/user/profile", (req, res, next) => {
  Feed.find({ author: req.user._id })
    .then(result => {
      res.render("user/profile", { showAllFeed: result.reverse() });
    })
    .catch(err => next(err));
});

// DELETE USER POST REQUEST
router.post("/deleteUser/:id", (req, res, next) => {
  let id = req.params.id;
  User.findByIdAndRemove(id)
  .then(result => {
    req.logout();
    res.redirect("/");
  });
});

module.exports = router;
