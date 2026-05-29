import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        comment: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Admin details - Replace with actual admin number
        const adminPhoneNumber = "919199882816"; 
        
        // Formatting the message for WhatsApp
        const message = `*New Contact Inquiry*%0A%0A` +
                        `*Name:* ${formData.name}%0A` +
                        `*Email:* ${formData.email}%0A` +
                        `*Phone:* ${formData.phone}%0A` +
                        `*Message:* ${formData.comment}`;

        const whatsappURL = `https://wa.me/${adminPhoneNumber}?text=${message}`;
        
        // Opening WhatsApp in a new tab
        window.open(whatsappURL, '_blank');
        
        alert("Redirecting to WhatsApp to send your message...");
    };

    return (
        <div className="contact-page">
            <div className="container narrow-container">
                <h1 className="page-title">Contact</h1>
                
                <div className="contact-info-block">
                    <h4>Contact us or reach us directly.</h4>
                    <p><strong>Email:</strong> trendify.support@gmail.com</p>
                </div>

                <div className="contact-form-wrapper">
                    <h2 className="form-heading">Contact form</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group flex-1">
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Email *" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <input 
                                type="tel" 
                                name="phone" 
                                placeholder="Phone number" 
                                value={formData.phone} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <textarea 
                                name="comment" 
                                placeholder="Comment" 
                                rows="6" 
                                value={formData.comment} 
                                onChange={handleChange} 
                                required
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="btn-black-send">SEND</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
