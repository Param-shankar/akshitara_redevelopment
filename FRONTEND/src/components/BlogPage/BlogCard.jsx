import React from "react";
import styles from "./BlogCard.module.css";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog, loading }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    if (!loading) navigate(`/blogs/${blog._id}`);
  };

  if (loading) {
    // Render the skeleton when loading is true
    return (
      <div className={`${styles.card} ${styles.skeleton}`}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonAuthor} />
        <div className={styles.skeletonCategories}>
          <span className={styles.skeletonCategory} />
          <span className={styles.skeletonCategory} />
        </div>
        <div className={styles.skeletonContent} />
        <div className={styles.skeletonButton} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{blog.title}</h2>
        <p className={styles.author}>
          By {blog.author} |{" "}
          {new Date(blog.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className={styles.categories}>
          {blog.categories.map((category, index) => (
            <span key={index} className={styles.category}>
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <p>{blog.summary}</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.readMore} onClick={handleReadMore}>
          Read More
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
