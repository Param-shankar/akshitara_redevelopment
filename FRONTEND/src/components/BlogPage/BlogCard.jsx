import React from "react";
import styles from "./BlogCard.module.css";
import { useNavigate } from "react-router-dom";
import imgplaceholder from "../../assets/image.png";
const BlogCard = ({ blog, loading }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    if (!loading) navigate(`/blogs/${blog._id}`);
  };

  if (loading) {
    // Render the skeleton when loading is true
    return (
      <div className={`${styles.card} ${styles.skeleton}`}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonContent} />
        <div className={styles.skeletonCategories}>
          <span className={styles.skeletonCategory} />
          <span className={styles.skeletonCategory} />
          <span className={styles.skeletonCategory} />
          <span className={styles.skeletonCategory} />
        </div>
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonAuthor} />
          <div className={styles.skeletonButton} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={blog.image || imgplaceholder}
          alt={blog.title}
          className={styles.blogImage}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{blog.title}</h2>
        <p className={styles.description}>{blog.summary}</p>
        <div className={styles.categories}>
          {blog.categories.map((category, index) => (
            <span key={index} className={styles.category}>
              {category}
            </span>
          ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>{blog.author}</span>
            <span className={styles.date}>
              {new Date(blog.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <button className={styles.readMore} onClick={handleReadMore}>
            Read more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
