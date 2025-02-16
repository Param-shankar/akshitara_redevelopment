import React from 'react';
import styles from './RecentPosts.module.css';

const recentPosts = [
  {
    id: 1,
    title: "How Nutrition Affects Ayurveda",
    category: "Nutrition",
  },
  {
    id: 2,
    title: "The Benefits of Ayurveda for Healing",
    category: "Wellness",
  },
];

const RecentPosts = () => {
  return (
    <div className={styles.recentContainer}>
      <h3>Recent Posts</h3>
      <div className={styles.recentPosts}>
        {recentPosts.map(post => (
          <div key={post.id} className={styles.post}>
            <h4>{post.title}</h4>
            <p>Category: {post.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
