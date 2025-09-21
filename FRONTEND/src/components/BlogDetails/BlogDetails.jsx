import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./BlogDetails.module.css";
import { FaShare } from "react-icons/fa";
import { fetchDataFromApi } from "../../utils/api";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const getBlog = async (blog_id) => {
  const res = await fetchDataFromApi(`/api/blogs/${blog_id}`);
  return res;
};

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await getBlog(id);
        setTimeout(() => {
          // Ensure skeleton shows for at least 1.5 seconds
          setBlog(fetchedBlog);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleShareClick = () => {
    const currentUrl = window.location.origin + location.pathname;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        handleClick();
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  if (loading) {
    return (
      <div className={styles.blogDetailsContainer}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonAuthor} />
        <div className={styles.skeletonCategories}>
          <span className={styles.skeletonCategory} />
          <span className={styles.skeletonCategory} />
        </div>
        <div className={styles.skeletonContent} />
        <div className={styles.skeletonShare} />
      </div>
    );
  }

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={styles.blogDetailsContainer}>
      <div className={styles.header}>
        <h1 className={styles.blogTitle}>{blog.title}</h1>
        <p className={styles.blogAuthor}>
          By {blog.author} |{" "}
          <span className={styles.blogDate}>{formattedDate}</span>
        </p>
        <div className={styles.blogCategories}>
          {blog.categories &&
            blog.categories?.map((category, index) => (
              <span key={index} className={styles.blogCategory}>
                {category}
              </span>
            ))}
        </div>
      </div>

      <div className={styles.blogContent}>
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <div className={styles.socialSharing}>
        Share this blog:
        <span onClick={handleShareClick}>
          <FaShare />
        </span>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Linked copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogDetails;
