import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/products`);
                if (response.ok) {
                    const data = await response.json();
                    setTrendingProducts(data.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching trending products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const imageFallback = (e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/300x400?text=Product+Image";
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <p className="hero-sub">NEW ARRIVALS 2026</p>
                    <h1>SMART FINDS FOR EVERYDAY LIVING</h1>
                    <p className="hero-desc">Everything you need — stylish, useful & affordable.</p>
                    <Link to="/products" className="btn-black-hero">Shop Trending Products</Link>
                </div>
            </section>

            {/* Category Grid Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="category-grid">
                        <div className="category-card">
                            <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" alt="Bags" onError={imageFallback} />
                            <div className="category-label">
                                <h3>STYLISH BAGS</h3>
                                <Link to="/products" className="shop-link">CLICK HERE</Link>
                            </div>
                        </div>
                        <div className="category-card">
                            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" alt="Home Decor" onError={imageFallback} />
                            <div className="category-label">
                                <h3>HOME DECOR</h3>
                                <Link to="/products" className="shop-link">CLICK HERE</Link>
                            </div>
                        </div>
                        <div className="category-card">
                            <img src="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80" alt="Woolen" onError={imageFallback} />
                            <div className="category-label">
                                <h3>WOOLEN CLOTHS</h3>
                                <Link to="/products" className="shop-link">CLICK HERE</Link>
                            </div>
                        </div>
                        <div className="category-card">
                            <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" alt="Wallets" onError={imageFallback} />
                            <div className="category-label">
                                <h3>MENS WALLET</h3>
                                <Link to="/products" className="shop-link">CLICK HERE</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Products Preview */}
            <section className="trending-section">
                <div className="container">
                    <h2 className="section-title">TRENDING PRODUCTS</h2>
                    {loading ? (
                        <p style={{textAlign: 'center'}}>Loading products...</p>
                    ) : (
                        <div className="trending-grid">
                            {trendingProducts.map(product => (
                                <Link to="/products" key={product._id} className="trending-item">
                                    <div className="trending-img-wrapper">
                                        <img src={product.image.startsWith('http') ? product.image : `${backendUrl}${product.image}`} alt={product.name} onError={imageFallback} />
                                        {product.countInStock > 0 && <span className="sale-tag">SALE</span>}
                                        {product.countInStock === 0 && <span className="sale-tag" style={{backgroundColor: '#666'}}>OUT OF STOCK</span>}
                                    </div>
                                    <div className="trending-info">
                                        <p className="item-cat">{product.category}</p>
                                        <h4>{product.name}</h4>
                                        <div className="item-pricing">
                                            <span className="price-now">₹{product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div style={{textAlign: 'center', marginTop: '40px'}}>
                        <Link to="/products" className="btn-outline-black">VIEW ALL PRODUCTS</Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-us-section">
                <div className="container">
                    <div className="why-us-grid">
                        <div className="why-item">
                            <i className="fas fa-wallet"></i>
                            <h3>Budget-friendly pricing</h3>
                            <p>Premium quality without the premium price tag. We source directly to keep costs low.</p>
                        </div>
                        <div className="why-item">
                            <i className="fas fa-medal"></i>
                            <h3>Quality-tested products</h3>
                            <p>Every item is rigorously checked by our team for durability and functionality.</p>
                        </div>
                        <div className="why-item">
                            <i className="fas fa-truck"></i>
                            <h3>Cash on Delivery</h3>
                            <p>Shop with confidence. Pay only when your items arrive at your doorstep.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter-home">
                <div className="container newsletter-container">
                    <h2>SUBSCRIBE TO OUR EMAILS</h2>
                    <p>Be the first to know about new collections and exclusive offers.</p>
                    <form className="newsletter-form-home" onSubmit={async (e) => {
                        e.preventDefault();
                        const email = e.target.elements[0].value;
                        try {
                            const response = await fetch(`${backendUrl}/api/subscribers`, {
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
                        <input type="email" placeholder="Email" required />
                        <button type="submit">SUBSCRIBE</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
