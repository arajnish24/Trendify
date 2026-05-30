import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './NewArrivals.css';

const NewArrivals = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await fetch("/api/products");
                if (response.ok) {
                    const data = await response.json();
                    // Assume last items are new arrivals
                    setNewProducts(data.slice(-3).reverse());
                }
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    const imageFallback = (e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/300x400?text=Product+Image";
    };

    return (
        <div className="new-arrivals-page">
            <div className="container narrow-container">
                <header className="new-arrivals-header">
                    <h1 className="page-title">New Arrivals</h1>
                    <div className="announcement-text">
                        <p>We are constantly on the lookout for smart, stylish, and useful products to make your life easier and more beautiful.</p>
                        <p><strong>New and useful products are added every week!</strong></p>
                    </div>
                </header>

                <div className="newsletter-box">
                    <h3>STAY IN THE LOOP</h3>
                    <p>Subscribe to our emails to be the first to know when new collections drop.</p>
                    <form className="newsletter-inline" onSubmit={async (e) => {
                        e.preventDefault();
                        const email = e.target.elements[0].value;
                        try {
                            const response = await fetch("/api/subscribers", {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email })
                            });
                            const data = await response.json();
                            alert(data.message);
                            if (response.ok) e.target.reset();
                        } catch (err) {
                            alert("Subscription failed. Please try again later.");
                        }
                    }}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit" className="btn-black">SUBSCRIBE</button>
                    </form>
                </div>

                <section className="recent-grid-section">
                    <h2 className="section-subtitle">RECENTLY ADDED</h2>
                    {loading ? (
                        <p style={{textAlign: 'center'}}>Loading new arrivals...</p>
                    ) : (
                        <div className="new-product-grid">
                            {newProducts.map(product => (
                                <div key={product._id} className="new-product-card">
                                    <div className="img-holder">
                                        <img src={product.image.startsWith('http') ? product.image : product.image} alt={product.name} onError={imageFallback} />
                                        <span className="new-badge">NEW</span>
                                    </div>
                                    <div className="info-holder">
                                        <p className="cat-tag">{product.category}</p>
                                        <h4>{product.name}</h4>
                                        <p className="price-tag">₹{product.price.toFixed(2)}</p>
                                        {(!user || !user.isAdmin) && (
                                            <button 
                                                className="add-to-cart-simple"
                                                onClick={() => addToCart(product)}
                                                disabled={product.countInStock === 0}
                                            >
                                                {product.countInStock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="shop-all-cta">
                    <Link to="/products" className="btn-outline-black">EXPLORE ALL PRODUCTS</Link>
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;
