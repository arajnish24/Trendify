import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminCustomers.css';

const AdminCustomers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
                setLoading(false);
            }
        };

        if (token) {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [token]);

    if (loading) return <div className="admin-container"><h2>Loading Customers...</h2></div>;

    return (
        <div className="customers-page">
            <div className="container">
                <h1 className="section-title">CUSTOMER DIRECTORY</h1>
                <div className="customer-card">
                    <div className="admin-table-wrapper">
                        <table className="customer-table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>MOBILE</th>
                                    <th>JOINED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(users) && users.length > 0) ? (
                                    users.map(u => {
                                        if (!u) return null;
                                        return (
                                            <tr key={u._id}>
                                                <td data-label="NAME">{u.name || 'N/A'}</td>
                                                <td data-label="EMAIL" className="customer-email">{u.email || 'N/A'}</td>
                                                <td data-label="MOBILE" className="customer-mobile">{u.mobile || 'N/A'}</td>
                                                <td data-label="JOINED" className="customer-joined">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px'}}>No customers found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
