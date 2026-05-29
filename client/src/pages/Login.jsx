import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-page">
            <div className="container" style={{maxWidth: '500px', padding: '80px 20px'}}>
                <h1 className="section-title">LOGIN</h1>
                {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '20px'}}>{error}</p>}
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <input 
                        type="text" 
                        placeholder="Email or Mobile Number" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{padding: '15px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{padding: '15px', border: '1px solid var(--border)', fontSize: '0.9rem'}}
                        required 
                    />
                    <button type="submit" className="btn-black" style={{padding: '18px'}}>SIGN IN</button>
                </form>
                <div style={{marginTop: '30px', textAlign: 'center'}}>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                        New customer? <Link to="/register" style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline'}}>Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
