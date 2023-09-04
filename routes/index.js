var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const multer = require("multer");
var path = require("path");
const crypto = require("crypto");

const userModel = require("./users");
const chatModel = require("./chat")
const statusModel = require("./status")

const localStrategy = require("passport-local");
const passport = require("passport");
passport.use(new localStrategy(userModel.authenticate()));


// multer code....
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(14, function (err, buff) {
      const fn = buff.toString("hex") + path.extname(file.originalname)
      cb(null, fn);
    })

  }
})

const upload = multer({ storage: storage, fileFilter: fileFilter })

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  }
  else {
    cb(new Error('jayda tez mt chal'), false)
  }
}

//for uploading Profile photo of loggedInUser...
router.post("/uploadProfilePhoto", upload.single("image"), (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).then((loggedInuser) => {
    loggedInuser.Profile_photo = req.file.filename;
    loggedInuser.save().then(() => {
      res.redirect("/dashboard");
    });
  });
});




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  res.render("register")
});

router.get('/dashboard', isLoggedIn, async function (req, res, next) {
  let loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const allUserWithoutLoggedInUser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });
  let allUser = await userModel.find();

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ loggedInuser, allUserWithoutLoggedInUser });
  } else {
    res.render('dashboard', { loggedInuser, allUser, allUserWithoutLoggedInUser })
  }

});

router.post("/saveChat", async function (req, res, next) {
  var chat = new chatModel({
    sender_id: req.body.sender_id,
    receiver_id: req.body.receiver_id,
    message: req.body.message
  })

  var newChat = await chat.save();
  res.send({ success: true, msg: 'chat inserted', data: { message: newChat.message } })
});

//for uploading Status of loggedInUser...
router.post("/uploadStatus", upload.single("image"), async (req, res) => {
  var loggedInuser = await userModel.findOne({ username: req.session.passport.user });

  const status = new statusModel({
    creator_id: loggedInuser._id,
    StatusCaption: req.body.StatusCaption,
    image: req.file.filename,
    uplodTime: new Date()
  })

  await status.save();
  res.redirect("/status");
});




router.get('/call', async function (req, res, next) {

  res.render('call')
});

router.get('/status', async function (req, res, next) {
  let loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const allUserWithoutLoggedInUser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });
  let allUser = await userModel.find();

  const statusOfLoggedInUser = await statusModel.find({ creator_id: loggedInuser._id })
    .populate('creator_id');

  const allStatusExceptLoggedInUser = await statusModel.find({ creator_id: { $ne: loggedInuser._id } })
    .populate('creator_id');

    const allStatus = await statusModel.find().populate('creator_id');

    console.log(statusOfLoggedInUser);
    console.log(allStatusExceptLoggedInUser);
  res.render('status', { loggedInuser, allUserWithoutLoggedInUser, allUser, statusOfLoggedInUser, allStatusExceptLoggedInUser, allStatus })
});


// for login logout 
router.post("/register", function (req, res, next) {
  var data = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    LastName: req.body.LastName,
  });
  userModel
    .register(data, req.body.password)
    .then(function (createdUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/dashboard");
      });
    })
    .catch(function (e) {
      res.send(e);
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  }),
  async function (req, res, next) { }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("user");
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render("login");
  }
}


module.exports = router;
