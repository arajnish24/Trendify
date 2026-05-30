import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Address.css';

const Address = () => {
    const { user, token, fetchProfile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        mobile: '',
        area: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        pincode: ''
    });

    const addresses = user?.addresses || [];
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            if ((user.addresses || []).length === 0) {
                setShowForm(true);
            }
        }
    }, [user]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingId 
                ? `/api/users/addresses/${editingId}`
                : `/api/users/addresses`;
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddress)
            });

            if (response.ok) {
                alert(`Address ${editingId ? 'updated' : 'added'} successfully!`);
                await fetchProfile();
                setNewAddress({
                    name: '', mobile: '', area: '', landmark: '', city: '', district: '', state: '', pincode: ''
                });
                setShowForm(false);
                setEditingId(null);
            } else {
                const data = await response.json();
                alert(data.message || "Failed to save address");
            }
        } catch (error) {
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (address) => {
        setNewAddress({
            name: address.name,
            mobile: address.mobile,
            area: address.area,
            landmark: address.landmark,
            city: address.city,
            district: address.district,
            state: address.state,
            pincode: address.pincode
        });
        setEditingId(address._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Delete this address?")) {
            try {
                const response = await fetch(`/api/users/addresses/${addressId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    await fetchProfile();
                    if (editingId === addressId) {
                        setEditingId(null);
                        setShowForm(false);
                        setNewAddress({
                            name: '', mobile: '', area: '', landmark: '', city: '', district: '', state: '', pincode: ''
                        });
                    }
                }
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    const cancelEdit = () => {
        setShowForm(false);
        setEditingId(null);
        setNewAddress({
            name: '', mobile: '', area: '', landmark: '', city: '', district: '', state: '', pincode: ''
        });
    };

    if (!user) return null;

    return (
        <div className="address-page">
            <div className="container address-form-container">
                <h1 className="section-title">DELIVERY ADDRESSES</h1>
                
                {/* Saved Addresses List */}
                {addresses.length > 0 && (
                    <div className="address-card" style={{marginBottom: '30px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                            <h2 style={{fontSize: '1.1rem'}}>Saved Addresses</h2>
                            {!showForm && (
                                <button onClick={() => setShowForm(true)} className="btn-outline-black" style={{padding: '8px 15px', fontSize: '0.8rem'}}>
                                    + ADD NEW
                                </button>
                            )}
                        </div>
                        <div className="saved-addresses-grid" style={{display: 'grid', gap: '20px'}}>
                            {addresses.map((addr) => (
                                <div key={addr._id} style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    position: 'relative'
                                }}>
                                    <p style={{fontWeight: 'bold', marginBottom: '5px'}}>{addr.name}</p>
                                    <p style={{fontSize: '0.9rem', color: '#555', marginBottom: '5px'}}>{addr.area}, {addr.landmark}</p>
                                    <p style={{fontSize: '0.9rem', color: '#555', marginBottom: '5px'}}>{addr.city}, {addr.district}, {addr.state} - {addr.pincode}</p>
                                    <p style={{fontSize: '0.9rem', color: '#555', marginBottom: '15px'}}>Mobile: {addr.mobile}</p>
                                    
                                    <div style={{display: 'flex', gap: '15px'}}>
                                        <button 
                                            onClick={() => handleEditClick(addr)} 
                                            style={{fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
                                        >
                                            EDIT
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAddress(addr._id)} 
                                            style={{fontSize: '0.8rem', color: 'red', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add/Edit Address Form */}
                {(showForm || addresses.length === 0) && (
                    <div className="address-card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                            <h2 style={{fontSize: '1.1rem'}}>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                            {addresses.length > 0 && (
                                <button onClick={cancelEdit} style={{background: 'none', border: 'none', color: '#888', cursor: 'pointer'}}>
                                    Cancel
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleAddAddress} className="address-form">
                            <div className="form-group full-width">
                                <label>FULL NAME</label>
                                <input type="text" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>MOBILE NUMBER</label>
                                <input type="text" value={newAddress.mobile} onChange={(e) => setNewAddress({...newAddress, mobile: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>PIN CODE</label>
                                <input type="text" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} required />
                            </div>
                            <div className="form-group full-width">
                                <label>AREA / COLONY / STREET</label>
                                <input type="text" value={newAddress.area} onChange={(e) => setNewAddress({...newAddress, area: e.target.value})} required />
                            </div>
                            <div className="form-group full-width">
                                <label>LANDMARK</label>
                                <input type="text" value={newAddress.landmark} onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>CITY</label>
                                <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>DISTRICT</label>
                                <input type="text" value={newAddress.district} onChange={(e) => setNewAddress({...newAddress, district: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>STATE</label>
                                <input type="text" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} required />
                            </div>
                            <div className="address-actions">
                                <button type="submit" className="btn-black" disabled={loading} style={{width: '100%', padding: '15px'}}>
                                    {loading ? "SAVING..." : "SAVE ADDRESS"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Address;
