var express = require("express");
var router = express.Router();
var Blog = require("../models/blog.js");
var passport = require("passport");
require("../config/passport")(passport);

/* GET ALL BlogS */
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
router.put("/:id", function(req, res, next) {
  Blog.findByIdAndUpdate(req.params.id, req.body, function(err, Blog) {
    if (err) return next(err);
    res.json(Blog);
  });
});

/* DELETE Blog */
router.delete("/:id", function(req, res, next) {
  Blog.findByIdAndRemove(req.params.id, req.body, function(err, Blog) {
    if (err) return next(err);
    res.json(Blog);
  });
});

module.exports = router;
