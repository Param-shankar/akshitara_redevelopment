import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_STRIPE_APP_DEV_URL + "api/auth",
});
console.log(
  "The URL is ",
  process.env.REACT_APP_STRIPE_APP_DEV_URL,
  process.env.REACT_APP_STRIPE_APP_DEV_URL + "api/auth"
);
export const googleAuth = (code) => api.get(`/google?code=${code}`);

// Ensure your environment variables are set up correctly
console.log(
  "Environment Variable REACT_APP_STRIPE_APP_DEV_URL:",
  process.env.REACT_APP_STRIPE_APP_DEV_URL
);
const API_BASE_URL =
  // process.env.REACT_APP_STRIPE_APP_DEV_URL || "http://localhost:4000/"; // Your new backend URL
  process.env.REACT_APP_STRIPE_APP_DEV_URL ; // Your new backend URL

console.log("API Base URL:", API_BASE_URL); // Log the base URL to verify it's correct

// Axios instance for making API requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Function to fetch data from API
export const fetchDataFromApi = async (url) => {
  console.log("Fetching data from:", url); // Log the URL being fetched
  try {
    const { data } = await axiosInstance.get(url);
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const PostDataFromApi = async (url, databody) => {
  console.log("Fetching data from:", url); // Log the URL being fetched
  try {
    const { data } = await axiosInstance.post(url, databody);
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

// Function to update data
export const updateData = async (url, updatedData) => {
  try {
    const { data } = await axiosInstance.put(url, updatedData);
    return data;
  } catch (err) {
    console.error("Error updating data:", err.response || err.message); // Log more details of the error
    throw err; // Throw error to be caught in the calling function
  }
};

// Axios instance for making payment requests (if different)
export const makePaymentRequest = axios.create({
  baseURL: process.env.REACT_APP_STRIPE_APP_DEV_URL, // Update with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});
