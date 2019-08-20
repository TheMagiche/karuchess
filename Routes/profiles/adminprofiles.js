const express = require("express");
const authRole = require("../../middleware/auth").authenticateRole;
const router = express.Router();
router.get("/", authRole, async (req, res) => {
  // View logged in user profile

  res.send(req.user);
});
router.post("/logout", authRole, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/logoutall", authRole, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
