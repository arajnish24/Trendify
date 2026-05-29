import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page-refined">
            <div className="container narrow-content">
                <header className="about-header">
                    <h1 className="page-title">About Us</h1>
                </header>

                <div className="about-narrative">
                    <p className="lead-text">
                        Welcome to <strong>TRENDIFY</strong>, your premier online destination for smart finds, stylish essentials, and high-quality products designed for the modern lifestyle.
                    </p>

                    <section className="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Based in India, TRENDIFY was born from a simple idea: to make everyday living more beautiful, organized, and affordable. We specialize in curated collections that range from designer handbags and premium travel gear to elegant home décor and cozy winter essentials.
                        </p>
                    </section>

                    <section className="about-section">
                        <h2>What We Stand For</h2>
                        <div className="pillars-grid">
                            <div className="pillar">
                                <h3>PRACTICAL CURATION</h3>
                                <p>We don't just sell products; we find solutions. Every item in our store is selected for its durability, functionality, and aesthetic appeal.</p>
                            </div>
                            <div className="pillar">
                                <h3>TRANSPARENT VALUE</h3>
                                <p>We believe high quality shouldn't come with a high price tag. We work directly with manufacturers to bring you premium items at budget-friendly prices.</p>
                            </div>
                            <div className="pillar">
                                <h3>CUSTOMER TRUST</h3>
                                <p>With secure payments, Cash on Delivery (COD) options, and reliable delivery across the country, we ensure a seamless and safe shopping experience from browse to unbox.</p>
                            </div>
                        </div>
                    </section>

                    <div className="mission-tagline">
                        <p className="tagline-text">"EVERYTHING YOUR LIFE NEEDS, MADE EASY."</p>
                    </div>

                    <section className="about-section last-section">
                        <h2>Join Our Community</h2>
                        <p>
                            We are constantly updating our inventory with new and useful products every week. We invite you to explore our collections and find items that simplify your daily life and enhance your personal space.
                        </p>
                        <p>
                            Thank you for choosing TRENDIFY. We're glad to be a part of your journey toward a smarter, more stylish home.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
