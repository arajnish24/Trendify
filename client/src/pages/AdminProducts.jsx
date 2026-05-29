import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: 'bags',
        image: null,
        countInStock: ''
    });
    const { token } = useAuth();
    const navigate = useNavigate();
    const backendUrl = 'http://localhost:5000';

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/products`);
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('description', currentProduct.description);
        formData.append('price', currentProduct.price);
        formData.append('category', currentProduct.category);
        formData.append('countInStock', currentProduct.countInStock);
        if (currentProduct.image instanceof File) {
            formData.append('image', currentProduct.image);
        }

        try {
            const response = await fetch(`${backendUrl}/api/products/${currentProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Product updated successfully');
                setIsEditing(false);
                fetchProducts();
            }
        } catch (error) {
            alert("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product permanently?")) {
            try {
                const response = await fetch(`${backendUrl}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    fetchProducts();
                }
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    if (loading) return <div className="admin-container"><h2>Loading Inventory...</h2></div>;

    return (
        <div className="admin-products-page">
            <div className="container">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
                    <h1 className="section-title" style={{margin: 0}}>PRODUCT INVENTORY</h1>
                    <button onClick={() => navigate('/admin/add-product')} className="btn-black" style={{padding: '12px 25px'}}>+ ADD NEW PRODUCT</button>
                </div>

                {isEditing && (
                    <div className="admin-card edit-overlay">
                        <div className="edit-header">
                            <h2>EDIT PRODUCT</h2>
                            <button onClick={() => setIsEditing(false)} className="close-btn">&times;</button>
                        </div>
                        <form onSubmit={handleUpdate} className="admin-form-grid">
                            <div className="form-group">
                                <label>NAME</label>
                                <input type="text" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>CATEGORY</label>
                                <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}>
                                    <option value="bags">Bags</option>
                                    <option value="decorations">Decorations</option>
                                    <option value="trolley bags">Trolley Bags</option>
                                    <option value="woolen cloths">Woolen Cloths</option>
                                    <option value="mens wallet">Mens Wallet</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>PRICE (₹)</label>
                                <input type="number" step="0.01" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>STOCK</label>
                                <input type="number" value={currentProduct.countInStock} onChange={(e) => setCurrentProduct({...currentProduct, countInStock: e.target.value})} required />
                            </div>
                            <div className="form-group full-span">
                                <label>UPDATE IMAGE</label>
                                <input type="file" accept="image/*" onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.files[0]})} />
                            </div>
                            <div className="form-group full-span">
                                <label>DESCRIPTION</label>
                                <textarea value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-black">SAVE CHANGES</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin-card list-card">
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>IMAGE</th>
                                    <th>NAME</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(products) && products.length > 0) ? (
                                    products.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <img 
                                                    src={(p.image || '').startsWith('http') ? p.image : `${backendUrl}${p.image}`} 
                                                    alt={p.name} 
                                                    className="prod-table-img" 
                                                />
                                            </td>
                                            <td style={{fontWeight: '700'}}>{p.name || 'N/A'}</td>
                                            <td><span className="category-tag">{(p.category || '').toUpperCase()}</span></td>
                                            <td>₹{Number(p.price || 0).toFixed(2)}</td>
                                            <td>
                                                <span className={`stock-status ${(p.countInStock || 0) < 5 ? 'low' : 'ok'}`}>
                                                    {p.countInStock || 0} left
                                                </span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button onClick={() => {setIsEditing(true); setCurrentProduct(p);}} className="edit-btn"><i className="fas fa-edit"></i></button>
                                                    <button onClick={() => handleDelete(p._id)} className="delete-btn"><i className="fas fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>No products found in catalog.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
