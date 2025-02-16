import React, { useEffect, useState, useRef, useCallback } from "react";
import CategoryFilters from "./CategoryFilters";
import BlogCard from "./BlogCard";
import styles from "./BlogPage.module.css";
import { fetchDataFromApi } from "../../utils/api";

const BlogPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);

  const observer = useRef();

  const getBlogs = async (page = 1) => {
    const res = await fetchDataFromApi(`/api/blogs?page=${page}`);
    setBlogs((prevBlogs) => [...prevBlogs, ...res]);
    setLoading(false);
  };

  useEffect(() => {
    // Start data fetching and 1.5-second skeleton timer simultaneously
    getBlogs(page);

    const skeletonTimeout = setTimeout(() => {
      setIsSkeletonVisible(false);
    }, 1000); // 1.5-second skeleton delay

    return () => clearTimeout(skeletonTimeout); // Cleanup timeout on unmount
  }, [page]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const filteredBlogs = selectedCategories.length
    ? blogs.filter((blog) =>
        blog.categories.some((category) =>
          selectedCategories.includes(category)
        )
      )
    : blogs;

  const lastBlogRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className={styles.container}>
      <CategoryFilters
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />
      <div className={styles.blogs}>
        {isSkeletonVisible || loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <BlogCard key={index} loading />
            ))
          : filteredBlogs.map((blog, index) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                ref={filteredBlogs.length === index + 1 ? lastBlogRef : null}
              />
            ))}
      </div>
    </div>
  );
};

export default BlogPage;
