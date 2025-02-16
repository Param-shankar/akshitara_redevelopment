import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import { fetchDataFromApi, updateData } from "../../utils/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all payments when the component loads
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true); // Start loading
      const res = await fetchDataFromApi("/api/orders"); // Adjusted the API endpoint
      setPayments(res);
      setLoading(false); // End loading
    };
    fetchPayments();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h1 className={styles.title}>Admin Panel - Payments</h1>
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
              <th>Date of Order</th> {/* Added Date of Order Column */}
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
                }
              >
                <td>{payment.razorpay_order_id}</td>
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
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>{" "}
                {/* Display Date Only */}
                <td>{payment.delivery_status}</td>
                <td>
                  <select
                    value={payment.delivery_status}
                    onChange={(e) =>
                      updateDeliveryStatus(payment._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
