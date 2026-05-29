import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const { user, token, loading } = useAuth();

  const navigate = useNavigate();

  // =====================================
  // FETCH ORDERS
  // =====================================
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
          console.error("API did not return array:", data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);

        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate, loading]);

  // =====================================
  // RETURN / REPLACEMENT REQUEST
  // =====================================
  const handleRequest = async (orderId, type) => {
    const action = type === "return" ? "return" : "replacement";
    const reason = window.prompt(`Please provide a reason for the ${action}:`);

    if (reason === null) return;
    if (!reason.trim()) {
      alert("Reason is required.");
      return;
    }

    const confirmRequest = window.confirm(
      `Are you sure you want to request a ${action}?`,
    );

    if (!confirmRequest) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: `${action} requested`,
            returnReplaceReason: reason,
          }),
        },
      );

      const updatedOrder = await response.json();

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? updatedOrder : order,
          ),
        );
        alert(`${action} request submitted successfully`);
      }
    } catch (error) {
      console.error(error);
      alert(`Failed to submit ${action} request`);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading || ordersLoading) {
    return (
      <div
        className="container"
        style={{
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <h2>Loading Your Orders...</h2>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="section-title">MY ORDERS</h1>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            <p>You haven't placed any orders yet.</p>

            <button
              onClick={() => navigate("/products")}
              className="btn-black"
              style={{
                marginTop: "20px",
              }}
            >
              SHOP NOW
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              if (!order) return null;

              const status = order.status || "";

              // Only show 4th stage if it's actually a return or replacement process
              const isReturn = status.includes("return") || status === "refunded" || status === "picked up";
              const isReplace = status.includes("replacement");
              const isReturnOrReplace = isReturn || isReplace;

              let fourthStageLabel = "Request";
              if (isReturn) fourthStageLabel = "Return";
              if (isReplace) fourthStageLabel = "Replace";

              let fourthStageStatus = "Pending";
              if (status.includes("accepted")) fourthStageStatus = "Accepted";
              if (status === "picked up") fourthStageStatus = "Picked Up";
              if (status === "refunded") fourthStageStatus = "Refunded";
              if (status === "replacement delivered") fourthStageStatus = "Completed";

              // Further Info Message
              let infoMessage = null;
              if (status.includes("requested")) {
                infoMessage = `Your ${isReturn ? "return" : "replacement"} request is awaiting admin approval.`;
              } else if (status.includes("accepted")) {
                infoMessage = `Admin has ACCEPTED your request. Our delivery partner will contact you for pickup shortly.`;
              } else if (status === "picked up") {
                infoMessage = `Product has been picked up. ${isReturn ? "Refund" : "Replacement"} is being processed.`;
              } else if (status === "refunded") {
                infoMessage = `Order successfully refunded to your original payment method.`;
              } else if (status === "replacement delivered") {
                infoMessage = `Your replacement product has been delivered. Thank you!`;
              } else if (status.includes("rejected")) {
                infoMessage = `Your request was not accepted by the admin. Please contact support for details.`;
              }

              return (
                <div
                  key={order._id}
                  className="admin-card"
                  style={{
                    marginBottom: "30px",
                    padding: "25px",
                  }}
                >
                  {/* HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "#888" }}>ORDER ID</p>
                      <p style={{ fontWeight: "800" }}>#{(order._id || "").toUpperCase()}</p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.8rem", color: "#888" }}>TOTAL AMOUNT</p>
                      <p style={{ fontWeight: "800" }}>₹{(order.totalPrice || 0).toFixed(2)}</p>
                      <p style={{ fontSize: "0.75rem", color: "#555", marginTop: "4px" }}>
                        {(order.paymentMethod || "").toUpperCase()}{" "}
                        {order.isPaid ? "(PAID)" : "(UNPAID)"}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <span
                      className={`status-badge ${status.replace(/ /g, "-")}`}
                      style={{
                        padding: "6px 15px",
                        fontSize: "0.75rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      Current Status: {status || "pending"}
                    </span>
                  </div>

                  {/* INFO MESSAGE */}
                  {infoMessage && (
                    <div
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderLeft: "4px solid black",
                        padding: "12px 20px",
                        marginBottom: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      <span style={{ fontWeight: "800", marginRight: "8px" }}>UPDATE:</span>
                      {infoMessage}
                    </div>
                  )}

                  {/* TIMELINE */}
                  <div
                    className="order-status-timeline"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "40px 0",
                      position: "relative",
                    }}
                  >
                    {/* Connecting Line */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: isReturnOrReplace ? "12%" : "15%",
                        right: isReturnOrReplace ? "12%" : "15%",
                        height: "2px",
                        backgroundColor: "#eee",
                        zIndex: 0,
                      }}
                    >
                      <div
                        style={{
                          width: (status === "refunded" || status === "replacement delivered")
                            ? "100%"
                            : order.deliveredAt
                            ? (isReturnOrReplace ? "66%" : "100%")
                            : order.shippedAt
                            ? (isReturnOrReplace ? "33%" : "50%")
                            : "0%",
                          height: "100%",
                          backgroundColor: "black",
                          transition: "width 0.5s ease",
                        }}
                      ></div>
                    </div>

                    <div style={{ textAlign: "center", flex: 1, zIndex: 1 }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "black", margin: "0 auto 10px", border: "4px solid white" }}></div>
                      <p style={{ fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Placed</p>
                      <small>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</small>
                    </div>

                    <div style={{ textAlign: "center", flex: 1, zIndex: 1 }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: order.shippedAt ? "black" : "#eee", margin: "0 auto 10px", border: "4px solid white" }}></div>
                      <p style={{ fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Shipped</p>
                      <small>{order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : "Pending"}</small>
                    </div>

                    <div style={{ textAlign: "center", flex: 1, zIndex: 1 }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: order.deliveredAt ? "black" : "#eee", margin: "0 auto 10px", border: "4px solid white" }}></div>
                      <p style={{ fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>Delivered</p>
                      <small>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "Pending"}</small>
                    </div>

                    {isReturnOrReplace && (
                      <div style={{ textAlign: "center", flex: 1, zIndex: 1 }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: (status === "refunded" || status === "replacement delivered") ? "black" : "#eee", margin: "0 auto 10px", border: "4px solid white" }}></div>
                        <p style={{ fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>{fourthStageLabel}</p>
                        <small>{fourthStageStatus}</small>
                      </div>
                    )}
                  </div>

                  {/* ITEMS */}
                  <div className="order-items">
                    {(order.orderItems || []).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "15px",
                          marginBottom: "10px",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={
                            (item.image || "").startsWith("http")
                              ? item.image
                              : `http://localhost:5000${item.image}`
                          }
                          alt={item.name}
                          style={{
                            width: "50px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />

                        <div>
                          <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>{item.name}</p>
                          <p style={{ fontSize: "0.8rem", color: "#888" }}>
                            Qty: {item.qty} | ₹{(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTION BUTTONS */}
                  {status === "delivered" && (
                    <div
                      style={{
                        marginTop: "20px",
                        borderTop: "1px solid #eee",
                        paddingTop: "15px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => handleRequest(order._id, "return")}
                        className="btn-outline-black"
                        style={{ padding: "8px 20px", fontSize: "0.8rem", flex: 1 }}
                      >
                        REQUEST RETURN
                      </button>

                      <button
                        onClick={() => handleRequest(order._id, "replace")}
                        className="btn-outline-black"
                        style={{ padding: "8px 20px", fontSize: "0.8rem", flex: 1 }}
                      >
                        REQUEST REPLACEMENT
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
