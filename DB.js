const mongoose = require("mongoose");
// require("dotenv").config();
const users = require("./models/users");
// const MongoClient = require("mongodb").MongoClient;
// mongoose.Promise = require("bluebird");

const client = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useCreateIndex: true
      // promiseLibrary: require("bluebird")
    })
    .then(() => console.log("connection succesful"))
    .catch(err => console.error(err));
};

const models = {
  users
};
module.exports = {
  client,
  models
};
