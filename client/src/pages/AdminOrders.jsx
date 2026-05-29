import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const updatedOrder = await response.json();
            if (response.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
            }
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleExpectedDateUpdate = async (orderId, date) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ expectedDeliveryDate: date })
            });
            const updatedOrder = await response.json();
            if (response.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
            }
        } catch (error) {
            alert("Failed to update expected delivery date");
        }
    };

    if (loading) return (
        <div className="admin-container">
            <div className="container">
                <h2 style={{marginTop: '100px'}}>Loading Orders...</h2>
                <p>Fetching your management details.</p>
            </div>
        </div>
    );

    return (
        <div className="admin-orders-page">
            <div className="container">
                <h1 className="section-title">ORDER MANAGEMENT</h1>
                <div className="admin-card">
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>CUSTOMER</th>
                                    <th>TOTAL</th>
                                    <th>STATUS</th>
                                    <th>EXP. DELIVERY</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    orders.map(order => {
                                        if (!order) return null;
                                        const status = order.status || 'pending';
                                        return (
                                            <tr key={order._id}>
                                                <td>{(order._id || '').slice(-6).toUpperCase()}</td>
                                                <td>{order.user?.name || 'Guest'}</td>
                                                <td>₹{Number(order.totalPrice || 0).toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${status.replace(/ /g, '-')}`}>
                                                        {(status || 'pending').toUpperCase()}
                                                    </span>
                                                    {order.returnReplaceReason && (
                                                        <div style={{fontSize: '0.7rem', color: '#e74c3c', marginTop: '5px', fontStyle: 'italic'}}>
                                                            Reason: {order.returnReplaceReason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <input 
                                                        type="date" 
                                                        value={order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : ''}
                                                        onChange={(e) => handleExpectedDateUpdate(order._id, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <select 
                                                        value={status} 
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="out for delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="return requested">Return Requested</option>
                                                        <option value="return accepted">Return Accepted</option>
                                                        <option value="return rejected">Return Rejected</option>
                                                        <option value="replacement requested">Replacement Requested</option>
                                                        <option value="replacement accepted">Replacement Accepted</option>
                                                        <option value="replacement rejected">Replacement Rejected</option>
                                                        <option value="picked up">Picked Up</option>
                                                        <option value="refunded">Refunded</option>
                                                        <option value="replacement shipped">Replacement Shipped</option>
                                                        <option value="replacement delivered">Replacement Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
