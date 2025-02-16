import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Consulting.css";

const Consulting = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = process.env.REACT_APP_STRIPE_APP_DEV_URL + "/api/consulting";
    try {
      const response = await fetch(url, {
        // Updated URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Form submitted successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        toast.error("Form submission failed!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="consulting-container">
      <h1>CONSULT WITH US</h1>
      <p>
        We are here to provide expert advice and guidance. Fill out the form
        below to schedule a consultation with our team.
      </p>
      <form onSubmit={handleSubmit} className="consulting-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Describe Your Concerns</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
      <ToastContainer containerId="consult"/>
    </div>
  );
};

export default Consulting;
