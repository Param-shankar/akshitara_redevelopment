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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      blog.categories.some((category) => selectedCategories.includes(category));
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.categories.some((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

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
      <div className={styles.sidebar}>
        <CategoryFilters
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
        />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search articles, Keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
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
    </div>
  );
};

export default BlogPage;
