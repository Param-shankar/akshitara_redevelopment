const express = require("express");
const {
  getAllBlogs,
  getBlogById,
  addBlog,
} = require("../controllers/blog.controller");
const router = express.Router();

router.get("/", getAllBlogs);

router.get("/:blog_id", getBlogById);

router.post("/", addBlog);

module.exports = router;
