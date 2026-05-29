import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.name || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
            setError("All fields are mandatory.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.mobile.length < 10) {
            setError("Please enter a valid mobile number.");
            return;
        }

        const result = await register(formData.name, formData.email, formData.mobile, formData.password);
        if (result.success) {
            alert("Account created successfully! Please log in.");
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="register-page">
            <div className="container" style={{maxWidth: '500px', padding: '80px 20px'}}>
                <h1 className="section-title">CREATE ACCOUNT</h1>
                <p style={{textAlign: 'center', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                    Join TRENDIFY for a smarter shopping experience.
                </p>
                
                {error && (
                    <div style={{
                        backgroundColor: '#fff0f0', 
                        color: '#d63031', 
                        padding: '12px', 
                        borderRadius: '4px', 
                        marginBottom: '20px', 
                        fontSize: '0.85rem',
                        border: '1px solid #fab1a0',
                        textAlign: 'center'
                    }}>
                        <i className="fas fa-exclamation-circle" style={{marginRight: '8px'}}></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <div className="form-group-reg">
                        <label style={{fontSize: '0.75rem', fontWeight: '700', marginBottom: '5px', display: 'block'}}>FULL NAME *</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="e.g. John Doe" 
                            value={formData.name} 
                            onChange={handleChange} 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                            required 
                        />
                    </div>

                    <div className="form-group-reg">
                        <label style={{fontSize: '0.75rem', fontWeight: '700', marginBottom: '5px', display: 'block'}}>EMAIL ADDRESS *</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="e.g. john@example.com" 
                            value={formData.email} 
                            onChange={handleChange} 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                            required 
                        />
                    </div>

                    <div className="form-group-reg">
                        <label style={{fontSize: '0.75rem', fontWeight: '700', marginBottom: '5px', display: 'block'}}>MOBILE NUMBER *</label>
                        <input 
                            type="tel" 
                            name="mobile"
                            placeholder="10-digit mobile number" 
                            value={formData.mobile} 
                            onChange={handleChange} 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                            required 
                        />
                    </div>

                    <div className="form-group-reg">
                        <label style={{fontSize: '0.75rem', fontWeight: '700', marginBottom: '5px', display: 'block'}}>PASSWORD *</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Minimum 6 characters" 
                            value={formData.password} 
                            onChange={handleChange} 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                            required 
                        />
                    </div>

                    <div className="form-group-reg">
                        <label style={{fontSize: '0.75rem', fontWeight: '700', marginBottom: '5px', display: 'block'}}>CONFIRM PASSWORD *</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="Re-enter your password" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            style={{width: '100%', padding: '12px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-black" style={{padding: '18px', marginTop: '10px'}}>CREATE ACCOUNT</button>
                </form>
                
                <div style={{marginTop: '30px', textAlign: 'center'}}>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                        Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline'}}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
