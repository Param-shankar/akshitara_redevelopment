import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { fetchDataFromApi, updateData, PostDataFromApi } from "../../utils/api";
import { useContext } from "react";
// import { CategoryContext } from "../../context/CategoryContext";
import { Context } from "../../utils/context";
import axios from "axios";
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setcategories] = useState();
  // Product form state
  const getCategories = async () => {
    const res = await fetchDataFromApi("/api/category");
    console.log("Categories fetched:", res);
    // alert(JSON.stringify(res));
    setcategories(res);
  };
  useEffect(() => {
    getCategories();
  }, []);
  const [productForm, setProductForm] = useState({
    product_name: "",
    description: "",
    Category: "",
    price: "",
    discount: 0,
    stock: "",
    // images: "",
    image1: "",
    image2: "",
    image3: "",
    materials: [],
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    author: "",
    categories: [],
    summary: "",
    content: "",
  });

  // Form states
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [productSuccess, setProductSuccess] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState(false);

  // Fetch all payments when the component loads
  useEffect(() => {
    if (activeTab === "orders") {
      const fetchPayments = async () => {
        setLoading(true);
        const res = await fetchDataFromApi("/api/orders");
        setPayments(res);
        setLoading(false);
      };
      fetchPayments();
    }
  }, [activeTab]);

  // Handle delivery status update
  const updateDeliveryStatus = async (paymentId, newDeliveryStatus) => {
    try {
      const updatedPayment = await updateData(`/api/orders/${paymentId}`, {
        delivery_status: newDeliveryStatus,
      });

      setPayments(
        payments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, delivery_status: newDeliveryStatus }
            : payment
        )
      );
    } catch (error) {
      console.error(
        "Error updating delivery status:",
        error.response || error.message
      );
    }
  };

  // Handle product form input changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    if (name === "size_list" || name === "materials") {
      setProductForm((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      }));
    } else {
      setProductForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle blog form input changes
  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    if (name === "categories") {
      setBlogForm((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      }));
    } else {
      setBlogForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle product form submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductSubmitting(true);
    setProductSuccess(false);

    try {
      const formData = {
        ...productForm,
        // images: productForm.images.split(", "),
        images: [
          productForm.image1,
          productForm.image2,
          productForm.image3,
        ].filter(Boolean),
        price: parseFloat(productForm.price),
      };

      await PostDataFromApi("/api/products/", formData);

      setProductSuccess(true);
      setProductForm({
        product_name: "",
        description: "",
        size_list: [],
        price: "",
        discount: 0,
        stock: "",
        // images: "",
        image1: "",
        image2: "",
        image3: "",
        materials: [],
      });
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setProductSubmitting(false);
    }
  };
  // Handle image upload for each image input
  // NOTE: Replace <your_unsigned_upload_preset> and <your_cloud_name> with actual values
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "urz983up");
    formData.append("cloud_name", "dkvtnjc2f");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dkvtnjc2f/image/upload",
        formData
      );
      console.log("Image uploaded:", res.data);

      // Update the corresponding image field in the product form
      setProductForm((prev) => ({
        ...prev,
        [fieldName]: res.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle blog form submission
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setBlogSubmitting(true);
    setBlogSuccess(false);

    try {
      await PostDataFromApi("/api/blogs/", blogForm);

      setBlogSuccess(true);
      setBlogForm({
        title: "",
        author: "",
        categories: [],
        author: "",
        summary: "",
        content: "",
      });
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setBlogSubmitting(false);
    }
  };

  const renderOrdersTab = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className={styles.ordersTable}>
        <table className={styles.paymentTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Date of Order</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className={
                  payment.delivery_status === "delivered"
                    ? styles.delivered
                    : styles.pending
                }>
                <td>
                  {payment.payment_method === "COD"
                    ? payment?.channel_order_id
                    : payment.razorpay_order_id}
                </td>
                <td>{payment.userName}</td>
                <td>{payment.address}</td>
                <td>{payment.phone_number}</td>
                <td>
                  <ul>
                    {payment.products.map((product, index) => (
                      <li key={index}>
                        {product.productName} (₹{product.productPrice}) x{" "}
                        {product.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{payment.amount}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.delivery_status}</td>
                <td>
                  <select
                    value={payment.delivery_status}
                    onChange={(e) =>
                      updateDeliveryStatus(payment._id, e.target.value)
                    }>
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProductForm = () => (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add New Product</h2>
      {productSuccess && (
        <div className={styles.successMessage}>
          Product created successfully!
        </div>
      )}
      <form onSubmit={handleProductSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="product_name">Product Name</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={productForm.product_name}
            onChange={handleProductChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={productForm.description}
            onChange={handleProductChange}
            required
            rows="4"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={productForm.price}
              onChange={handleProductChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={productForm.discount}
              onChange={handleProductChange}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={productForm.stock}
              onChange={handleProductChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="Category">Category</label>
          <select
            id="Category"
            name="Category"
            value={productForm.Category}
            onChange={handleProductChange}
            required>
            <option value="">Select Category</option>
            {console.log(categories)}
            {Array.isArray(categories) &&
              categories?.map((cat) => {
                console.log("the cat is ", cat);
                return (
                  <option key={cat._id || cat} value={cat.tittle || cat}>
                    {cat.title}
                  </option>
                );
              })}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="materials">Materials (comma-separated)</label>
          <input
            type="text"
            id="materials"
            name="materials"
            value={productForm.materials.join(", ")}
            onChange={handleProductChange}
            placeholder="Cotton, Silk, Wool"
          />
        </div>

        <div className={styles.formGroup}>
          {/* <label htmlFor="images">Image URLs (comma-separated)</label> */}
          <label htmlFor="image1">Primary Image (required)</label>
          <input
            type="file"
            id="image1"
            name="image1"
            accept="image/*"
            required
            onChange={(e) => handleImageUpload(e, "image1")}
          />{" "}
          {productForm.image1 && (
            <a
              href={productForm.image1}
              target="_blank"
              rel="noopener noreferrer">
              {productForm.image1}
            </a>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image2">Secondary Image (optional)</label>
          <input
            type="file"
            id="image2"
            name="image2"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "image2")}
          />
          {productForm.image2 && (
            <a
              href={productForm.image2}
              target="_blank"
              rel="noopener noreferrer">
              {productForm.image2}
            </a>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image3">Secondary Image (optional)</label>
          <input
            type="file"
            id="image3"
            name="image3"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "image3")}
          />
          {productForm.image3 && (
            <a
              href={productForm.image3}
              target="_blank"
              rel="noopener noreferrer">
              {productForm.image3}
            </a>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={productSubmitting}>
          {productSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );

  const renderBlogForm = () => (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add New Blog Post</h2>
      {blogSuccess && (
        <div className={styles.successMessage}>
          Blog post created successfully!
        </div>
      )}
      <form onSubmit={handleBlogSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogForm.title}
            onChange={handleBlogChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={blogForm.author}
            onChange={handleBlogChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categories">Categories (comma-separated)</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={blogForm.categories.join(", ")}
            onChange={handleBlogChange}
            placeholder="Health, Ayurveda, Wellness"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="blogCategoryDropdown">
            Category (select multiple)
          </label>
          <select
            id="blogCategoryDropdown"
            name="categories"
            multiple
            value={blogForm.categories}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(
                (opt) => opt.value
              );
              setBlogForm((prev) => ({
                ...prev,
                categories: selectedOptions,
              }));
            }}
            required
            style={{ minHeight: "100px" }}>
            <option value="Nutrition">Nutrition</option>
            <option value="Myths">Myths</option>
            <option value="Awareness">Awareness</option>
            <option value="Treatment">Treatment</option>
            <option value="Wellness">Wellness</option>
            <option value="Diseases">Diseases</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={blogForm.content}
            onChange={handleBlogChange}
            required
            rows="10"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="summary">summary</label>
          <textarea
            id="content"
            name="summary"
            value={blogForm.summary}
            onChange={handleBlogChange}
            required
            rows="10"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={blogSubmitting}>
          {blogSubmitting ? "Creating..." : "Create Blog Post"}
        </button>
      </form>
    </div>
  );

  return (
    <div className={styles.ordersContainer}>
      <h1 className={styles.title}>Admin Panel</h1>

      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "orders" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("orders")}>
          Orders
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "products" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("products")}>
          Add Product
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "blogs" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("blogs")}>
          Add Blog
        </button>
      </div>

      {activeTab === "orders" && renderOrdersTab()}
      {activeTab === "products" && renderProductForm()}
      {activeTab === "blogs" && renderBlogForm()}
    </div>
  );
};

export default AdminPanel;
