// import React from 'react';
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Cart.css";
import "./Payment.css";

const Payment = () => {
  const { cart, total, handlingFee, deliveryCharge, finalTotal, clearCart } =
    useCart();

  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");

  const codFee = paymentMethod === "cod" ? 9 : 0;
  const currentTotal = finalTotal + codFee;

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(() => {
    if (user?.address && user?.addresses) {
      const idx = user.addresses.findIndex(
        (a) => a.name === user.address.name && a.mobile === user.address.mobile,
      );
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const selectedAddress = user?.addresses?.[selectedAddressIndex] || null;

  // Redirect Logic
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
    }
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [user, cart, navigate, authLoading]);

  // ==========================
  // HANDLE PAYMENT
  // ==========================
  const handlePayment = async () => {
    if (!selectedAddress) {
        alert("Please select or add a delivery address");
        return;
    }

    const orderPayload = {
        orderItems: (Array.isArray(cart) ? cart : []).map(item => ({
            name: item?.name || 'Unknown Item',
            qty: item?.qty || 1,
            image: item?.image || '',
            price: item?.price || 0,
            product: item?._id
        })),
        shippingAddress: {
            address: `${selectedAddress?.area || ''}, ${selectedAddress?.landmark || ''}`,
            city: selectedAddress?.city || '',
            phone: selectedAddress?.mobile || ''
        },
        totalPrice: currentTotal,
        paymentMethod: paymentMethod
    };

    if (paymentMethod === "cod") {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderPayload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to place COD order");
        }

        alert("Order Placed Successfully via Cash on Delivery!");
        clearCart();
        navigate("/");
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to place order");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);

      // ==========================
      // STEP 1: CREATE RAZORPAY ORDER
      // ==========================
      const response = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: currentTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order creation failed");
      }

      const order = data.order || data;

      // ==========================
      // STEP 2: RAZORPAY OPTIONS
      // ==========================
      const options = {
        key: "rzp_test_Suj6MFM0REzM2B", // Test mode
        amount: order.amount,
        currency: order.currency,
        name: "TRENDIFY",
        description: "Order Payment",
        image: "/favicon.svg",
        order_id: order.id,

        // ==========================
        // PAYMENT SUCCESS HANDLER
        // ==========================
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              "http://localhost:5000/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
                // Save Order to DB after payment verification
                const finalOrderPayload = {
                    ...orderPayload,
                    isPaid: true,
                    paidAt: new Date(),
                };

                const saveOrderResponse = await fetch("http://localhost:5000/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(finalOrderPayload),
                });

                if (saveOrderResponse.ok) {
                    alert("Payment Successful & Order Placed!");
                    clearCart();
                    navigate("/");
                } else {
                    alert("Payment Verified but failed to save order details.");
                }
            } else {
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.error(error);
            alert("Verification Error");
          }
        },

        // ==========================
        // PREFILL USER DETAILS
        // ==========================
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: selectedAddress?.mobile || user?.mobile || "",
        },

        // ==========================
        // NOTES
        // ==========================
        notes: {
          address: selectedAddress
            ? `${selectedAddress.area}, ${selectedAddress.city}`
            : "TRENDIFY Customer",
        },

        // ==========================
        // THEME
        // ==========================
        theme: {
          color: "#000000",
        },

        // ==========================
        // MODAL CLOSE
        // ==========================
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      // ==========================
      // OPEN RAZORPAY
      // ==========================
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
    catch (error) {
      console.error(error);
      alert(error.message || "Payment Failed");
    }
    finally {
      setLoading(false);
    }
  };

  // Empty State
  if (authLoading || !user || cart.length === 0) {
    return authLoading ? <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}><h2>Loading Payment...</h2></div> : null;
  }

  return (
    <div className="cart-page payment-page">
      <div className="container">
        <h1 className="section-title">ORDER SUMMARY</h1>
        <div className="cart-grid">
          {/* LEFT SECTION */}
          <div className="cart-items-list">
            {/* ADDRESS */}
            <div className="payment-address-card">
              <div className="payment-address-header">
                <h3 className="payment-address-title">DELIVERY ADDRESS</h3>
                {user.addresses && user.addresses.length > 0 && (
                  <Link
                    to="/address"
                    className="shop-link"
                    style={{ fontSize: "0.8rem", color: "var(--primary)" }}
                    onClick={() =>
                      localStorage.setItem("checkout_redirect", "true")
                    }
                  >
                    CHANGE / ADD ADDRESS
                  </Link>
                )}
              </div>

              {user.addresses && user.addresses.length > 0 ? (
                <>
                  <div className="payment-address-select-wrapper">
                    <select
                      className="payment-address-select"
                      value={selectedAddressIndex}
                      onChange={(e) =>
                        setSelectedAddressIndex(Number(e.target.value))
                      }
                    >
                      {user.addresses.map((addr, index) => (
                        <option key={addr._id || index} value={index}>
                          {addr.name} - {addr.area}, {addr.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAddress && (
                    <div className="payment-address-details">
                      <p>
                        <strong>{selectedAddress.name}</strong>
                      </p>
                      <p>
                        {selectedAddress.area}, {selectedAddress.landmark}
                      </p>
                      <p>
                        {selectedAddress.city}, {selectedAddress.district}
                      </p>
                      <p>
                        {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      <p>Mobile: {selectedAddress.mobile}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="payment-no-address">
                  <p className="payment-no-address-text">
                    No delivery address found.
                  </p>
                  <button
                    className="btn-outline-black"
                    onClick={() => {
                      localStorage.setItem("checkout_redirect", "true");
                      navigate("/address");
                    }}
                  >
                    ADD NEW ADDRESS
                  </button>
                </div>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="payment-address-card">
              <h3 className="payment-address-title" style={{ marginBottom: "15px" }}>SELECT PAYMENT METHOD</h3>
              <div className="payment-method-options">
                <label className="payment-method-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <span>Online Payment (Razorpay)</span>
                </label>
                <label className="payment-method-option">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>Cash on Delivery (+₹9.00 Handling Cost)</span>
                </label>
              </div>
            </div>

            {/* ITEMS */}
            <div className="payment-items-card">
              <h3 className="payment-items-title">ITEMS IN YOUR BAG</h3>
              {(Array.isArray(cart) ? cart : []).map((item) => {
                if (!item) return null;
                const itemImg = (item.image || '').startsWith("http")
                        ? item.image
                        : `http://localhost:5000${item.image}`;
                return (
                  <div key={item._id} className="payment-item">
                    <img
                      src={itemImg}
                      alt={item.name || 'Item'}
                      className="payment-item-img"
                    />
                    <div>
                      <h4 className="payment-item-name">{item.name || 'Unknown Item'}</h4>
                      <p className="payment-item-price">
                        Qty: {item.qty || 0} | ₹{(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="cart-summary">
            <div className="summary-box">
              <h3 className="payment-summary-title">ORDER SUMMARY</h3>

              <div className="payment-summary-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="payment-summary-row">
                <span>Handling Fee</span>
                <span>₹{handlingFee.toFixed(2)}</span>
              </div>

              {paymentMethod === "cod" && (
                <div className="payment-summary-row">
                  <span>COD Handling Cost</span>
                  <span>₹9.00</span>
                </div>
              )}

              <div className="payment-summary-row">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge > 0
                    ? `₹${deliveryCharge.toFixed(2)}`
                    : "FREE"}
                </span>
              </div>

              <hr className="payment-summary-divider" />

              <div className="payment-summary-grand-total">
                <span>Grand Total</span>
                <span>₹{currentTotal.toFixed(2)}</span>
              </div>

              <p className="shipping-note" style={{ marginTop: "10px" }}>
                Final amount including all taxes and fees.
              </p>

              <div className="payment-btn-wrapper">
                <button
                  className="checkout-btn"
                  onClick={handlePayment}
                  disabled={loading || !selectedAddress}
                >
                  {loading ? "PROCESSING..." : (paymentMethod === "cod" ? "PLACE ORDER" : "CONTINUE TO PAYMENT")}
                </button>
              </div>

              <p className="payment-secure-text">
                {paymentMethod === "online" ? "Secure payment via Razorpay" : "Pay securely upon delivery"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
