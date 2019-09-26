const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const Feed = require("../models/Feed");
const bcrypt = require("bcryptjs");
const uploadCloud = require('../config/cloudinary.js');
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// sign up route
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// post signup route to DB

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
      console.log("SUCCESS!!!!");

      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

// // login get route
// router.get("/", (req, res, next) => {
//   res.render("user/profile");
// });

// LOGIN POST ROUTE
router.post("/login",  (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username })
    .then(userFromDB => {
      if (!userFromDB) {
        console.log("This user doesnt exist");
        res.redirect("/");
      }

      if (bcrypt.compareSync(password, userFromDB.password)) {
        req.session.currentUser = userFromDB;
        console.log(req.session.currentUser);
        res.redirect("/user/profile");
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
  res.redirect("/");
});



// create feed post Request
router.post("/user/profile/image", uploadCloud.single('photo'), (req, res, next) => {
  console.log('the user >>>>> >>>> >>>> >>>>> > ', req.session.currentUser);
  
  console.log("---------------------- ", req.body.photo)
  console.log("!#!$#%!$%!#$%#%#%#%#%!@#$", req.body)
  console.log("---------------------- ", req.file.url)
  User.findByIdAndUpdate(req.session.currentUser, {
      picture: req.file.url
  }, {new: true})
    .then(result => {
      console.log("profile update ><><><>><><><><><><><><><><><><><><><><><><><>><><><><><><>< ", result);
      req.session.currentUser = result;

      res.redirect("/user/profile");
    })
    .catch(err => next(err));
});






router.post("/user/profile/feed", (req, res, next) => {

  console.log(req.body.feed)
  console.log("!#!$#%!$%!#$%#%#%#%#%!@#$", req.body)
  Feed.create({
      caption: req.body.feed,
      author: req.session.currentUser._id
  })
    .then(result => {
      console.log(result)
      console.log("feed created", result);

      res.redirect("/user/profile");
    })
    .catch(err => next(err));
});








// DELETE FEED
router.post("/user/profile/delete/:id", (req, res, next) => {

  let id = req.params.id;
  
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", id)
  Feed.findByIdAndRemove(id)
  
  .then(result=>{

    console.log('deleted')
    
    res.redirect("/user/profile")    
  
  })
  .catch(err => {
    next(err);
  })
})


// Edit Post
router.get("/user/edit/:id", (req, res, next) => {

  let id = req.params.id;

  Feed.findByIdAndUpdate(id)
  
  .then(result=>{

    console.log('<<<<<<<<<updated >>>>>>>>>>>>>>')
    
    res.render("user/edit", {thisPost: result})    
  
  })
  .catch(err => {
    next(err);
  })
})






// update to new post
router.post("/user/edit/:id", (req, res, next) => {

  let id = req.params.id;
console.log(id)
  Feed.findByIdAndUpdate(id, req.body)
  
  .then(result=>{

    console.log('<<<<<<<<< EDITED  >>>>>>>>>>>>>>', result)
    
    res.redirect("/user/profile")    
  
  })
  .catch(err => {
    next(err);
  })
})

// Update  User Get Request
router.get("/user/update/:id", (req, res, next) => {
  console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
  console.log(req.session)
  let id = req.params.id;
  const user = req.session.currentUser
      
  res.render("user/update", {theUser: user})   
})

// update username and pic
router.post("/user/update/:id", (req, res, next) => {

  let id = req.params.id;

console.log(id)
  User.findByIdAndUpdate(id, {username: req.body.username})
  
  .then(result=>{

    console.log('<<<<<<<<< EDITED  >>>>>>>>>>>>>>', result)
    
    res.redirect("/user/profile")    
  
  })
  .catch(err => {
    next(err);
  })
})










// Show user feed Route
router.get("/user/profile", (req, res, next) => {

  console.log('user/profile =======>>>>>>>>')
  Feed.find({author: req.session.currentUser._id})


    .then(result => {     
      console.log(result)
      res.render("user/profile", {showAllFeed: result.reverse() });
    })
    .catch(err => next(err));
});

// logout POST route
router.post("/deleteUser/:id", (req, res, next) => {
  // literally destroys the session

  let id = req.params.id;

  User.findByIdAndRemove(id)

  .then(result=>{

    req.session.destroy();
    res.redirect("/")
  })
  
});



//  User-only private page
// router.post("/", (req, res, next) => {
//   if (userFromDB) {
//     res.redirect("user/profile", { theUser: userFromDB });
//   } else {
//     res.redirect("/");
//   }
// });

// // Get Request after login
// router.get("/profile", (req, res, next) => { 
//   console.log("it works") 
//   res.render("user/profile");  
// });

// router.post("/profile", (req, res, next) => { 
//   // console.log("it works") 
//   // res.render("user/profile");  


//   res.redirect('/profile')
// });


// Edit Route







module.exports = router;
