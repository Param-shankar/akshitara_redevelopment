const express = require("express");
const { getAllBlogs, getBlogById } = require("../controllers/blog.controller");
const router = express.Router();

router.get("/", getAllBlogs);

router.get("/:blog_id", getBlogById);

module.exports = router;
