// import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="site-header">
            {/* Announcement Bar */}
            <div className="announcement-bar">
                <div className="container">
                    <p>FREE SHIPPING ON ALL ORDERS | CASH ON DELIVERY AVAILABLE</p>
                </div>
            </div>
            
            {/* Top Utility Bar */}
            <div className="top-bar">
                <div className="container top-bar-container">
                    <div className="logo-centered">
                        <Link to="/">TRENDIFY</Link>
                    </div>
                    {/* <div className="social-icons-top">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-pinterest"></i></a>
                    </div> */}
                    
                    <div className="search-bar-top">
                        <input type="text" placeholder="Search for products..." />
                        <button><i className="fas fa-search"></i></button>
                    </div>
                    
                    <div className="top-actions">
                        <div className="user-section" ref={userMenuRef}>
                            <div className="user-trigger" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <i className="far fa-user"></i>
                                {user && (user.isAdmin === true || String(user.isAdmin) === 'true') ? (
                                    <span>ADMIN</span>
                                ) : (
                                    user && user.name && <span>{(user.name || '').toUpperCase()}</span>
                                )}
                            </div>
                            {showUserMenu && (
                                <div className="user-dropdown" style={{display: 'flex', flexDirection: 'column'}}>
                                    {(!user) ? (
                                        <>
                                            <Link to="/login" onClick={() => setShowUserMenu(false)}>LOGIN</Link>
                                            <Link to="/register" onClick={() => setShowUserMenu(false)}>SIGN UP</Link>
                                        </>
                                    ) : (user.isAdmin === true || String(user.isAdmin) === 'true') ? (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Link to="/admin/dashboard" onClick={() => setShowUserMenu(false)} style={{backgroundColor: '#f9f9f9', borderLeft: '4px solid var(--primary)', fontWeight: '800'}}>DASHBOARD</Link>
                                            <Link to="/admin/customers" onClick={() => setShowUserMenu(false)}>CUSTOMER DETAILS</Link>
                                            <Link to="/admin/orders" onClick={() => setShowUserMenu(false)}>ORDER DETAILS</Link>
                                            <Link to="/admin/products" onClick={() => setShowUserMenu(false)}>MANAGE PRODUCTS</Link>
                                            <Link to="/admin/add-product" onClick={() => setShowUserMenu(false)}>ADD NEW PRODUCT</Link>
                                            <hr style={{margin: '5px 0', border: '0', borderTop: '1px solid #eee'}} />
                                            <button onClick={handleLogout} className="logout-btn-nav">LOGOUT</button>
                                        </div>
                                    ) : (
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Link to="/orders" onClick={() => setShowUserMenu(false)}>ORDERS</Link>
                                            <Link to="/address" onClick={() => setShowUserMenu(false)}>SAVE ADDRESS</Link>
                                            <Link to="/cards" onClick={() => setShowUserMenu(false)}>SAVE CARD DETAILS</Link>
                                            <Link to="/faq" onClick={() => setShowUserMenu(false)}>HELP CENTER</Link>
                                            <hr style={{margin: '5px 0', border: '0', borderTop: '1px solid #eee'}} />
                                            <button onClick={handleLogout} className="logout-btn-nav">LOGOUT</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {(!user || !user.isAdmin) && (
                            <Link to="/cart" className="cart-trigger">
                                <i className="fas fa-shopping-bag"></i>
                                <span className="cart-count">
                                    {Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.qty || 0), 0) : 0}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Logo & Main Navigation */}
            <div className="main-header">
                <div className="container">
                    {/* <div className="logo-centered">
                        <Link to="/">TRENDIFY</Link>
                    </div> */}
                    <nav className="main-nav">
                        <ul className="nav-links-centered">
                            <li><Link to="/">HOME</Link></li>
                            <li><Link to="/products">ALL PRODUCTS</Link></li>
                            <li><Link to="/new-arrivals">NEW ARRIVALS</Link></li>
                            <li><Link to="/about">ABOUT US</Link></li>
                            <li><Link to="/contact">CONTACT</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
