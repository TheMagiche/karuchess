const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  lichess_id: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: [true, "Created date is required"]
  },
  roles: {
    type: String,
    default: "User"
  }
});

UserSchema.pre("save", function(next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
  next();
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
UserSchema.methods.getUserDetails = function() {
  let user = {
    username: this.username,
    email: this.email,
    lichess_id: this.lichess_id,
    role: this.roles
  };
  return user;
};

module.exports = mongoose.model("user", UserSchema);
