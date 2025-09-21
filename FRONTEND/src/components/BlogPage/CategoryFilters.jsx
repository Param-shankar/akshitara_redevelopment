import React from "react";
import styles from "./CategoryFilters.module.css";

const CategoryFilters = ({ selectedCategories, toggleCategory }) => {
  const [categories] = React.useState([
    "Nutrition",
    "Myths",
    "Awareness",
    "Treatment",
    "Wellness",
    "Diseases",
  ]);
  // const [c]
  return (
    <div className={styles.filtersContainer}>
      {categories.map((category) => (
        <label key={category} className={styles.filterItem}>
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => toggleCategory(category)}
            className={styles.checkbox}
          />
          <span className={styles.filterLabel}>{category}</span>
        </label>
      ))}
    </div>
  );
};

export default CategoryFilters;
