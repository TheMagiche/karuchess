const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: [true, "Created date is required"]
  },
  published_date: {
    type: Date,
    required: [true, "Created date is required"]
  },
  read_time: {
    type: String,
    required: false
  },
  thumbnail: {
    type: String,
    required: false
  }
});

BlogSchema.methods.getBlogDetails = function() {
  let blog = {
    title: this.title,
    author: this.author,
    content: this.content,
    created_date: this.created_date,
    published_date: this.published_date,
    read_time: this.read_time,
    thumbnail: this.thumbnail
  };
  return blog;
};

module.exports = mongoose.model("blog", BlogSchema);
