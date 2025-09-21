const axios = require("axios");

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

// Cache storage for token
let shiprocketToken = null;
let tokenExpiry = null;

// Function to authenticate and get token
async function getShiprocketToken() {
  if (shiprocketToken && tokenExpiry && new Date() < tokenExpiry) {
    console.log("Using cached Shiprocket token.");
    return shiprocketToken;
  }

  console.log("Fetching new Shiprocket token...");
  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });

    shiprocketToken = response.data.token;
    tokenExpiry = new Date(Date.now() + 23 * 60 * 60 * 1000);
    console.log("Fetching token fetched .");
    return shiprocketToken;
  } catch (error) {
    console.error(
      "Error getting Shiprocket token:",
      error.response?.data || error.message
    );
    throw new Error("Shiprocket authentication failed");
  }
}

// Function to create an order in Shiprocket
async function createShiprocketOrder(orderData) {
  try {
    const token = await getShiprocketToken();

    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Shiprocket order:",
      error.response?.data || error.message
    );
    throw new Error("Shiprocket order creation failed");
  }
}

// Function to calculate shipping charge
async function calculateShippingCharge(
  pincode,
  weight,
  length,
  breadth,
  height,
  Cod
) {
  try {
    const token = await getShiprocketToken();
    console.log("Calculating shipping charge for:");

    const response = await axios.get(
      `${SHIPROCKET_BASE_URL}/courier/serviceability/`,
      {
        params: {
          pickup_postcode: "110001", // Change this to your warehouse/store pincode
          delivery_postcode: pincode,
          cod: Cod ? 1: 0, // 0 for prepaid orders
          weight: weight, // Weight in kg
          length: length, // Length in cm x
          breadth: breadth, // Breadth in cm
          height: height, // Height in cm
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const availableCouriers = response.data.data.available_courier_companies;

    if (!availableCouriers || availableCouriers.length === 0) {
      throw new Error("No shipping options available for the given location.");
    }

    // Choose the cheapest available courier
    const cheapestCourier = availableCouriers.reduce((prev, curr) =>
      prev.rate < curr.rate ? prev : curr
    );
    console.log("Cheapest Courier:", cheapestCourier.rate, );  
    
    return {
      shippingCharge: cheapestCourier.rate,
      courierName: cheapestCourier.courier_name,
      courierId: cheapestCourier.courier_company_id,
    };
  } catch (error) {
    console.error(
      "Error calculating shipping charge:",
      error.response?.data || error.message
    );
    throw new Error("Shipping charge calculation failed");
  }
}

module.exports = { createShiprocketOrder, calculateShippingCharge };
