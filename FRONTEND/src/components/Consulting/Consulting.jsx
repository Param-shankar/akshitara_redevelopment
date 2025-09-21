import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Consulting.scss";
import { InlineWidget } from "react-calendly";

const Consulting = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url = process.env.REACT_APP_STRIPE_APP_DEV_URL + "/api/consulting";
//     try {
//       const response = await fetch(url, {
//         // Updated URL
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         toast.success("Form submitted successfully!");
//         setTimeout(() => {
//           window.location.href = "/";
//         }, 2000);
//       } else {
//         toast.error("Form submission failed!");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again later.");
//     }
//   };


  return (
    <div className="consulting-container">
      <div className="calendly-widget" style={{ position: "relative" }}>
        <InlineWidget
          url="https://calendly.com/akshitaraayurved/new-meeting"
          styles={{
            height: "105%",
            overflowY: "hidden",
            backgroundColor: "6bb967",
          }}
          pageSettings={{
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
          }}
        />
      </div>
    </div>
  );
};

export default Consulting;
