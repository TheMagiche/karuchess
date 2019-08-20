// var mongoose = require("mongoose");
var passport = require("passport");
// var settings = require("./user_settings");
require("./user")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require("../models/users");

router.post("/register", async (req, res) => {
  console.log("Receiving details ..");
  if (!req.body.username || !req.body.password) {
    return res.json({
      success: false,
      msg: "Please pass username and password."
    });
  } else {
    console.log("Saving details ..");
    const user = await new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      lichess_id: req.body.lichessId,
      created: Date.now()
    }).save();
    console.log("saved");
    if (user.username !== req.body.username) {
      return res.json({ success: false, msg: "Username already exists." });
    }
    return res.json({ success: true, msg: "Successful created new user." });
  }
});
router.post("/login", function(req, res) {
  User.findOne(
    {
      username: req.body.username
    },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: "Authentication failed. User not found."
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), process.env.JWT_KEY);
            // return the information including token as JSON
            res.json({ success: true, token: "JWT " + token });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password."
            });
          }
        });
      }
    }
  );
});

module.exports = router;
