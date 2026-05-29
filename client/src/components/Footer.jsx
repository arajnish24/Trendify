import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-column brand-col">
                        <h2 className="logo">TRENDIFY</h2>
                        <p className="footer-desc">
                            Smart finds for everyday living. Stylish, useful, and affordable products delivered to your doorstep.
                        </p>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-pinterest"></i></a>
                        </div>
                    </div>
                    
                    <div className="footer-column">
                        <h3>POLICIES</h3>
                        <ul>
                            <li><Link to="#">Privacy Policy</Link></li>
                            <li><Link to="#">Refund Policy</Link></li>
                            <li><Link to="#">Shipping Policy</Link></li>
                            <li><Link to="#">Terms of Service</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h3>QUICK LINKS</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="#">FAQ</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column newsletter-col">
                        <h3>NEWSLETTER</h3>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Enter your email" required />
                            <button type="submit" className="btn-black">SUBSCRIBE</button>
                        </form>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>© 2026, TRENDIFY Powered by React</p>
                    <div className="payment-methods">
                        <i className="fab fa-cc-visa"></i>
                        <i className="fab fa-cc-mastercard"></i>
                        <i className="fab fa-cc-apple-pay"></i>
                        <i className="fab fa-cc-paypal"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
