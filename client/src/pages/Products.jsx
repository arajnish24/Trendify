// import React from 'react';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();
    const { user } = useAuth();

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h2>Loading Products...</h2></div>;
    if (error) return <div className="container" style={{padding: '100px 0', textAlign: 'center', color: 'red'}}><h2>Error: {error}</h2></div>;

    return (
        <div className="products-page">
            <div className="container">
                <header className="products-header">
                    <h1 className="section-title">ALL PRODUCTS</h1>
                </header>
                
                <div className="products-grid">
                    {products.length === 0 ? (
                        <p style={{textAlign: 'center', gridColumn: '1/-1'}}>No products found.</p>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-image-wrapper">
                                    <img 
                                        src={product.image.startsWith('http') ? product.image : product.image} 
                                        alt={product.name} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://via.placeholder.com/300x400?text=Image+Not+Found";
                                        }}
                                    />
                                    {product.countInStock === 0 && (
                                        <span className="sale-badge" style={{backgroundColor: '#666'}}>OUT OF STOCK</span>
                                    )}
                                </div>
                                <div className="product-content">
                                    <p className="product-category">{product.category.toUpperCase()}</p>
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-pricing">
                                        <span className="current-price">₹{product.price.toFixed(2)}</span>
                                    </div>
                                    {(!user || !user.isAdmin) && (
                                        <button 
                                            className="add-to-cart-full"
                                            onClick={() => addToCart(product)}
                                            disabled={product.countInStock === 0}
                                        >
                                            {product.countInStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
