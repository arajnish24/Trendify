import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, total, handlingFee, deliveryCharge, finalTotal, removeFromCart, updateQty } = useCart();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await fetch(`/api/products`);
                const data = await response.json();
                // Get 4 random products
                const shuffled = data.sort(() => 0.5 - Math.random());
                setSuggestions(shuffled.slice(0, 4));
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };

        if (cart.length === 0) {
            fetchSuggestions();
        }
    }, [cart.length]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/login');
            } else if (user.isAdmin) {
                navigate('/admin/dashboard');
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div className="container" style={{padding: '100px 20px', textAlign: 'center'}}>Loading bag...</div>;
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container" style={{textAlign: 'center', padding: '100px 20px'}}>
                    <h1 className="section-title">YOUR BAG IS EMPTY</h1>
                    <p style={{color: 'var(--text-muted)', marginBottom: '40px'}}>Explore our collections to find something you love.</p>
                    <Link to="/products" className="btn-black">SHOP NOW</Link>

                    {suggestions.length > 0 && (
                        <div className="cart-suggestions" style={{marginTop: '80px'}}>
                            <h2 style={{fontSize: '1.2rem', marginBottom: '30px', letterSpacing: '2px'}}>SUGGESTED FOR YOU</h2>
                            <div className="products-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}}>
                                {(Array.isArray(suggestions) ? suggestions : []).map(product => {
                                    if (!product) return null;
                                    const imgUrl = (product.image || '').startsWith('http') ? product.image : product.image;
                                    return (
                                        <div key={product._id} className="product-card" onClick={() => navigate('/products')}>
                                            <div className="product-image">
                                                <img src={imgUrl} alt={product.name || 'Product'} />
                                            </div>
                                            <div className="product-info">
                                                <h3>{product.name || 'Unknown Product'}</h3>
                                                <p className="price">₹{(product.price || 0).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="section-title">YOUR BAG</h1>
                
                <div className="cart-grid">
                    <div className="cart-items-list">
                        <div className="cart-header-row">
                            <span>PRODUCT</span>
                            <span>QUANTITY</span>
                            <span>TOTAL</span>
                        </div>
                        
                        {(Array.isArray(cart) ? cart : []).map(item => {
                            if (!item) return null;
                            const itemImg = (item.image || '').startsWith('http') ? item.image : item.image;
                            return (
                                <div key={item._id} className="cart-item">
                                    <div className="item-main">
                                        <img src={itemImg} alt={item.name || 'Item'} />
                                        <div className="item-details">
                                            <h3>{item.name || 'Unknown Item'}</h3>
                                            <p>₹{(item.price || 0).toFixed(2)}</p>
                                            <button onClick={() => removeFromCart(item._id)} className="remove-btn">Remove</button>
                                        </div>
                                    </div>
                                    
                                    <div className="item-qty-controls">
                                        <button onClick={() => updateQty(item._id, (item.qty || 1) - 1)}>-</button>
                                        <span>{item.qty || 1}</span>
                                        <button onClick={() => updateQty(item._id, (item.qty || 1) + 1)}>+</button>
                                    </div>
                                    
                                    <div className="item-total-price">
                                        ₹{((item.price || 0) * (item.qty || 0)).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="cart-summary">
                        <div className="summary-box">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Handling Fee</span>
                                <span>₹{handlingFee.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Charge</span>
                                <span>{deliveryCharge > 0 ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}</span>
                            </div>
                            <hr style={{margin: '15px 0', border: '0', borderTop: '1px solid #eee'}} />
                            <div className="summary-row" style={{fontWeight: '800', fontSize: '1.2rem'}}>
                                <span>Grand Total</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                            <p className="shipping-note">Taxes calculated at checkout</p>
                            <button 
                                className="checkout-btn"
                                onClick={() => {
                                    if (user && user.address && user.address.city) {
                                        navigate('/payment');
                                    } else {
                                        localStorage.setItem('checkout_redirect', 'true');
                                        navigate('/address');
                                    }
                                }}
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
