import React from "react";
import styles from "./CategoryFilters.module.css";

const CategoryFilters = ({ selectedCategories, toggleCategory }) => {
  const categories = [
    "Nutrition",
    "Myths",
    "Awareness",
    "Treatment",
    "Wellness",
    "Diseases",
  ];

  return (
    <div className={styles.filtersContainer}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.filterButton} ${
            selectedCategories.includes(category) ? styles.selected : ""
          }`}
          onClick={() => toggleCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
