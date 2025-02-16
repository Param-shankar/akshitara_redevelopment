import React from "react";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>About Akshitara Ayurveda</h1>
        <p className={styles.description}>
          At Akshitara Ayurveda, we believe in the power of Ayurveda to restore
          balance and promote holistic well-being. Our carefully crafted
          Ayurvedic products are inspired by ancient wisdom, designed to support
          modern lifestyles through natural healing.
        </p>

        <h2 className={styles.subtitle}>Our Offerings</h2>
        <p className={styles.description}>
          We offer a wide range of Ayurvedic products, each created to provide
          functional benefits that promote overall wellness:
        </p>

        <ul className={styles.offeringsList}>
          <li>
            <strong>Ayurvedic Sharbats & Drinks:</strong> Refreshing and
            revitalizing drinks that harness the power of nature to boost your
            energy, improve digestion, and reduce stress.
          </li>
          <li>
            <strong>Cosmetics:</strong> Natural skincare and beauty products
            that enhance your appearance while nourishing your skin with herbal
            ingredients.
          </li>
          <li>
            <strong>Instant Mix Food:</strong> Ayurvedic instant food mixes that
            combine convenience with wellness, promoting a balanced diet even in
            a busy lifestyle.
          </li>
          <li>
            <strong>Herbal Remedies:</strong> A range of remedies addressing
            common health concerns such as digestion, stress, and immunity,
            using time-tested Ayurvedic ingredients.
          </li>
        </ul>

        <h2 className={styles.subtitle}>Why Choose Akshitara Ayurveda?</h2>
        <p className={styles.description}>
          At Akshitara Ayurveda, we are committed to delivering products of the
          highest quality. We combine traditional Ayurvedic knowledge with
          modern production techniques to create products that are both
          effective and safe. Our ingredients are ethically sourced, and our
          production processes are designed to preserve the purity and potency
          of the herbs we use.
        </p>

        <p className={styles.description}>
          Experience the holistic benefits of Ayurveda with Akshitara
          Ayurveda—where nature meets wellness. Whether you're looking to
          enhance your beauty routine, improve your diet, or support your
          overall health, our range of products is here to help.
        </p>
      </div>
    </div>
  );
};

export default About;
