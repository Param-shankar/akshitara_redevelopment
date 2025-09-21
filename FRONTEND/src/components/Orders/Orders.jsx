import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.scss";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-info"));
    if (userData) {
      setUser({
        id: userData.user_id,
        name: userData.name,
      });
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = user
          ? `http://localhost:4000/api/orders/user/${user.id}`
          : null;
        if (url) {
          const response = await axios.get(url);
          console.log("Orders fetched:", response.data);
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "status-completed";
      case "failed":
        return "status-failed";
      default:
        return "";
    }
  };

  return (
    <div className="orders-page">
      <h1 className="orders-title">
        {user ? `${user.name}'s Orders` : "All Orders"}
      </h1>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className={`order-card ${
                order.delivery_status.toLowerCase() === "delivered"
                  ? "delivered"
                  : ""
              }`}>
              <div className="order-header">
                <h2>
                  #
                  {order?.payment_method === "COD"
                    ? order.channel_order_id
                    : order.razorpay_order_id}
                </h2>

                <span className={`status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p>
                  <strong>Amount:</strong> ₹{order.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(order.createdAt)}
                </p>
                <p>
                  <strong>Delivery Status:</strong>{" "}
                  <span
                    className={`delivery-status ${order.delivery_status.toLowerCase()}`}>
                    {order.delivery_status}
                  </span>
                </p>

                <p>
                  <strong>(ShipRocket Tracking) /order id:</strong>{" "}
                  <span className={`delivery-status ${order?.order_id}`}>
                    {order?.payment_method === "COD"
                      ? order.channel_order_id
                      : order.razorpay_order_id}
                  </span>
                </p>
              </div>
              <div className="order-products">
                <h3>Products</h3>
                <ul>
                  {order.products.map((product) => (
                    <li key={product.productId}>
                      <span className="product-name">
                        {product.productName}
                      </span>
                      <span className="product-details">
                        {product.quantity} x ₹{product.productPrice.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-total">
                <strong>Total:</strong> ₹{order.amount.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
