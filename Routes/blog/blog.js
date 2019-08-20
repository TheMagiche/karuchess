var express = require("express");
var router = express.Router();
// var mongoose = require("mongoose");
var Blog = require("../../models/blog.js");
var passport = require("passport");
require("../../controllers/user")(passport);

/* GET ALL BLOGS */
router.get("/", function(req, res) {
  Blog.find(function(err, Blogs) {
    if (err) return next(err);
    res.json(Blogs);
  });
});

let getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

/* GET SINGLE Blog BY ID */
router.get("/:id", function(req, res, next) {
  Blog.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Blog */
router.post("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  var token = getToken(req.headers);
  if (token) {
    Blog.create(req.body, function(err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/* UPDATE Blog */
router.put("/:id", passport.authenticate("jwt", { session: false }), function(
  req,
  res,
  next
) {
  var token = getToken(req.headers);
  if (token) {
    Blog.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/* DELETE Blog */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
      Blog.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
