import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import NewArrivals from './pages/NewArrivals';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Address from './pages/Address';
import CardDetails from './pages/CardDetails';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminCustomers from './pages/AdminCustomers';
import AdminOrders from './pages/AdminOrders';
import './App.css';
import { useAuth } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  
  const isAdmin = user && (user.isAdmin === true || String(user.isAdmin) === 'true');

  if (!isAdmin && !loading && user) {
    return <div className="container" style={{padding: '150px 0', textAlign: 'center'}}><h2>Access Denied</h2><p>You must be an administrator to view this page.</p></div>;
  }

  if (!user && !loading) return null;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-wrapper">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/address" element={<Address />} />
                <Route path="/cards" element={<CardDetails />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/add-product" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
