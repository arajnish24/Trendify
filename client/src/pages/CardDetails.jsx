import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Address.css'; // Reusing styles

const CardDetails = () => {
    const { user, token, fetchProfile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const cards = user?.cards || [];

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    const [newCard, setNewCard] = useState({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cardType: 'Visa'
    });

    const handleAddCard = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCard)
            });

            if (response.ok) {
                alert("Card saved successfully!");
                await fetchProfile();
                setNewCard({
                    cardHolderName: '',
                    cardNumber: '',
                    expiryDate: '',
                    cardType: 'Visa'
                });
            } else {
                alert("Failed to save card");
            }
        } catch (error) {
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm("Remove this card?")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/cards/${cardId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    await fetchProfile();
                }
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    if (!user) return null;

    return (
        <div className="address-page">
            <div className="container address-form-container">
                <h1 className="section-title">SAVED CARDS</h1>

                {/* List of Saved Cards */}
                {cards.length > 0 && (
                    <div className="address-card" style={{marginBottom: '30px'}}>
                        <h2 style={{fontSize: '1rem', marginBottom: '20px'}}>Your Payment Methods</h2>
                        <div className="saved-cards-list">
                            {cards.map(card => (
                                <div key={card._id} style={{
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    padding: '15px',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}>
                                    <div>
                                        <p style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{card.cardType.toUpperCase()} - {card.cardNumber}</p>
                                        <p style={{fontSize: '0.8rem', color: '#888'}}>{card.cardHolderName} | Exp: {card.expiryDate}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteCard(card._id)}
                                        style={{background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer'}}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Card Form */}
                <div className="address-card">
                    <h2 style={{fontSize: '1rem', marginBottom: '20px'}}>Add New Card</h2>
                    <form onSubmit={handleAddCard} className="address-form">
                        <div className="form-group full-width">
                            <label>CARDHOLDER NAME</label>
                            <input 
                                type="text" 
                                value={newCard.cardHolderName}
                                onChange={(e) => setNewCard({...newCard, cardHolderName: e.target.value})}
                                placeholder="Name as on card"
                                required 
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>CARD NUMBER</label>
                            <input 
                                type="text" 
                                value={newCard.cardNumber}
                                onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                                placeholder="16-digit card number"
                                maxLength="16"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>EXPIRY DATE (MM/YY)</label>
                            <input 
                                type="text" 
                                value={newCard.expiryDate}
                                onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                                maxLength="5"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>CARD TYPE</label>
                            <select 
                                value={newCard.cardType}
                                onChange={(e) => setNewCard({...newCard, cardType: e.target.value})}
                                style={{padding: '12px', border: '1px solid #ddd', borderRadius: '4px'}}
                            >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="Rupay">Rupay</option>
                                <option value="Amex">Amex</option>
                            </select>
                        </div>
                        <div className="address-actions">
                            <button type="submit" className="btn-black" disabled={loading} style={{width: '100%', padding: '15px'}}>
                                {loading ? "SAVING..." : "SAVE CARD DETAILS"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CardDetails;
