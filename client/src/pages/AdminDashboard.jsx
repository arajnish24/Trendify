import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // ... (rest of the fetch logic)
                const authHeaders = { Authorization: `Bearer ${token}` };

                const [ordersRes, usersRes, productsRes] = await Promise.all([
                    fetch(`/api/orders`, { headers: authHeaders }),
                    fetch(`/api/users`, { headers: authHeaders }),
                    fetch(`/api/products`)
                ]);

                if (!ordersRes.ok || !usersRes.ok || !productsRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const ordersData = await ordersRes.json();
                const usersData = await usersRes.json();
                const productsData = await productsRes.json();

                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setUsers(Array.isArray(usersData) ? usersData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);

            } catch (err) {
                console.error(err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Update Order Status
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(
                `/api/orders/${orderId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            // Update UI instantly
            setOrders(prevOrders =>
                (Array.isArray(prevOrders) ? prevOrders : []).map(order =>
                    order._id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

        } catch (err) {
            console.error(err);
            alert('Failed to update order status');
        }
    };

    // Loading UI
    if (loading) {
        return (
            <div className="admin-container">
                <div className="container">
                    <h2 style={{marginTop: '100px'}}>Loading Dashboard...</h2>
                    <p>Please wait while we fetch the latest data.</p>
                </div>
            </div>
        );
    }

    // Error UI
    if (error) {
        return (
            <div className="admin-container">
                <div className="container">
                    <h2 style={{marginTop: '100px', color: '#e44343'}}>ERROR</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-black" style={{marginTop: '20px'}}>RETRY</button>
                </div>
            </div>
        );
    }

    // Safety check for critical data
    if (!token) {
        return (
            <div className="admin-container">
                <div className="container">
                    <h2 style={{marginTop: '100px'}}>SESSION EXPIRED</h2>
                    <p>Please log in again to access the admin panel.</p>
                    <button onClick={() => navigate('/login')} className="btn-black" style={{marginTop: '20px'}}>LOG IN</button>
                </div>
            </div>
        );
    }

    // Total Sales
    const totalSales = (Array.isArray(orders) ? orders : []).reduce(
        (acc, order) => acc + Number(order?.totalPrice || 0),
        0
    );

    // Monthly Orders
    const monthlyOrders = (Array.isArray(orders) ? orders : []).reduce((acc, order) => {
        if (!order || !order.createdAt) return acc;

        try {
            const date = new Date(order.createdAt);
            if (isNaN(date.getTime())) return acc;
            
            const month = date.toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
        } catch (e) {
            console.error("Date parsing error:", e);
        }

        return acc;
    }, {});

    return (
        <div className="admin-dashboard">
            <div className="container">

                <h1 className="section-title">
                    ADMIN DASHBOARD
                </h1>

                {/* Stats Section */}
                <div className="admin-stats-grid">

                    <div className="stat-card">
                        <h3>TOTAL SALES</h3>
                        <p className="stat-value">
                            ₹{Number(totalSales || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>TOTAL ORDERS</h3>
                        <p className="stat-value">
                            {(Array.isArray(orders) ? orders : []).length}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>CUSTOMERS</h3>
                        <p className="stat-value">
                            {(Array.isArray(users) ? users : []).length}
                        </p>
                    </div>

                    <div className="stat-card">
                        <h3>PRODUCTS</h3>
                        <p className="stat-value">
                            {(Array.isArray(products) ? products : []).length}
                        </p>
                    </div>

                </div>

                <div className="admin-main-grid">

                    {/* Monthly Orders */}
                    <div className="admin-card">
                        <h2>Monthly Orders</h2>

                        <div className="chart-placeholder">

                            {Object.entries(monthlyOrders).map(
                                ([month, count]) => (
                                    <div
                                        key={month}
                                        className="chart-bar-wrapper"
                                    >
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${
                                                    (Array.isArray(orders) && orders.length)
                                                        ? (Number(count) / orders.length) * 100
                                                        : 0
                                                }%`
                                            }}
                                        >
                                            <span>{count}</span>
                                        </div>

                                        <p>{month}</p>
                                    </div>
                                )
                            )}

                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="admin-card">
                        <h2>Inventory Insights</h2>

                        <div className="inventory-list">

                            {(Array.isArray(products) ? products : []).map(product => {
                                if (!product) return null;

                                const soldCount = (Array.isArray(orders) ? orders : []).reduce(
                                    (acc, order) => {
                                        if (!order) return acc;
                                        const item =
                                            (order.orderItems || []).find(
                                                oi =>
                                                    oi && String(oi.product) === String(product._id)
                                            );

                                        return acc + Number(item?.qty || 0);

                                    },
                                    0
                                );

                                return (
                                    <div
                                        key={product._id}
                                        className="inventory-item"
                                    >
                                        <span>{product.name || 'Unknown'}</span>

                                        <div className="inv-details">

                                            <span className="sold">
                                                Sold: {soldCount}
                                            </span>

                                            <span className="remaining">
                                                Stock: {product.countInStock || 0}
                                            </span>

                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;