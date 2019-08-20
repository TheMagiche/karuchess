const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authorize = function(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: process.env.JWT_KEY }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      next();
    }
  ];
};

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

const authenticateRole = function(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const user = User.findOne({
      _id: data._id,
      "tokens.token": token
    });
    if (err) throw err;
    if (!user) {
      next(err);
    } else {
      const token = jwt.sign(
        { user_id: user._id, username: user.username, role: user.role },
        process.env.JWT_KEY
      );
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token
      };
    }
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = { authorize, auth, authenticateRole };
