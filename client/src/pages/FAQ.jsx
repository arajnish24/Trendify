import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
    {
        question: "Is it safe to buy products from TRENDIFY?",
        answer: "Yes, it is completely safe. We use high-standard secure payment gateways and offer Cash on Delivery (COD) for your peace of mind. Your data privacy is our top priority."
    },
    {
        question: "What kind of products does TRENDIFY sell?",
        answer: "We specialize in smart utility items, high-quality home decor, stylish bags, woolen cloths, and ladies' wallets. Our collections are curated to simplify your life and beautify your home."
    },
    {
        question: "Which areas in India does TRENDIFY deliver to?",
        answer: "We offer Pan-India delivery! Whether you are in a metro city or a smaller town, we strive to bring our trending products to your doorstep as fast as possible."
    },
    {
        question: "Why should I buy from TRENDIFY?",
        answer: "We focus on 'Practical Curation'—every item is tested for quality and utility. We provide premium products at budget-friendly prices, direct-to-consumer delivery, and dedicated customer support."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can use this link to monitor your package's journey in real-time."
    }
];

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFaqs = faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="faq-page">
            <div className="container narrow-content">
                <h1 className="page-title">FAQ</h1>

                <div className="faq-search-wrapper">
                    <div className="search-input-group">
                        <input 
                            type="text" 
                            placeholder="Search our help center..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                </div>

                <div className="faq-list-container">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <h3 className="faq-question">{faq.question}</h3>
                                <p className="faq-answer">{faq.answer}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No FAQs found matching your search.</p>
                    )}
                </div>

                <div className="contact-support-cta">
                    <p>Still have questions?</p>
                    <a href="/contact" className="btn-outline-black">CONTACT SUPPORT</a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
