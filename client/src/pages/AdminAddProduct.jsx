import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminAddProduct.css';

const AdminAddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('countInStock', product.countInStock);
        if (product.image) {
            formData.append('image', product.image);
        }

        try {
            const response = await fetch(`${backendUrl}/api/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Product created successfully');
                navigate('/admin/products');
            } else {
                const data = await response.json();
                alert(data.message || "Failed to create product");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-add-product-page">
            <div className="container">
                <div className="admin-breadcrumb">
                    <span onClick={() => navigate('/admin/dashboard')}>Dashboard</span> / 
                    <span onClick={() => navigate('/admin/products')}> Manage Products</span> / 
                    <strong> Add New</strong>
                </div>
                
                <h1 className="section-title">ADD NEW PRODUCT</h1>

                <div className="admin-card add-product-card">
                    <form onSubmit={handleSubmit} className="admin-form-modern">
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>PRODUCT NAME</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter product title"
                                    value={product.name}
                                    onChange={(e) => setProduct({...product, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>CATEGORY</label>
                                <select 
                                    value={product.category}
                                    onChange={(e) => setProduct({...product, category: e.target.value})}
                                >
                                    <option value="bags">Bags</option>
                                    <option value="decorations">Decorations</option>
                                    <option value="trolley bags">Trolley Bags</option>
                                    <option value="woolen cloths">Woolen Cloths</option>
                                    <option value="mens wallet">Mens Wallet</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label>PRICE (INR)</label>
                                <div className="input-with-icon">
                                    <span>₹</span>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        step="0.01"
                                        value={product.price}
                                        onChange={(e) => setProduct({...product, price: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>STOCK QUANTITY</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter available stock"
                                    value={product.countInStock}
                                    onChange={(e) => setProduct({...product, countInStock: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>PRODUCT IMAGE</label>
                            <div className="file-upload-wrapper">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setProduct({...product, image: e.target.files[0]})}
                                    required
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="file-label">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                    {product.image ? product.image.name : "Drag & drop or click to upload"}
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>DESCRIPTION</label>
                            <textarea 
                                rows="5"
                                placeholder="Describe the product features and details..."
                                value={product.description}
                                onChange={(e) => setProduct({...product, description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-actions-bottom">
                            <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline-black">CANCEL</button>
                            <button type="submit" className="btn-black" disabled={loading}>
                                {loading ? "CREATING..." : "PUBLISH PRODUCT"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAddProduct;
