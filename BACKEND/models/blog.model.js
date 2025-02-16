const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    },
  },
  categories: {
    type: [String],
    required: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
