import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Mystic Flora</h1>
          <p>Your destination for enchanting flowers and plants</p>
          <button className="hero-button">Explore Now</button>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1615488913817-095134dfeb54?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8"
            alt="Mystic Flora"
          />
        </div>
      </section>

      <section className="info-section">
        <div className="info-block">
          <h2>Fast Delivery 24/7</h2>
          <p>Prompt, fresh, and vibrant flowers at your doorstep anytime.</p>
        </div>
        <div className="info-block">
          <h2>Only Fresh Picks</h2>
          <p>Hand-selected plants and flowers for every moment and space.</p>
        </div>
        <div className="info-block">
          <h2>Made with Love</h2>
          <p>Each arrangement crafted by passionate florists and gardeners.</p>
        </div>
        <div className="info-block">
          <h2>Range of Choices</h2>
          <p>From classic bouquets to exotic plants — find your perfect match.</p>
        </div>
      </section>

      <section className="story-section">
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            At Mystic Flora, we believe nature’s beauty should fill every corner of your life. Our curated
            selection of flowers and plants brings charm, peace, and vitality to homes and workplaces alike.
          </p>
          <h2>Our Vision</h2>
          <p>
            We envision a world where everyone experiences the therapeutic power of greenery. Our mission is
            to make premium, thoughtfully chosen flora accessible to all.
          </p>
        </div>
        <div className="story-image">
          <img
            src="https://plus.unsplash.com/premium_photo-1677005659579-dfdefd6e6c09?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQyfHx8ZW58MHx8fHx8"
            alt="Our Story"
          />
        </div>
      </section>

      <footer className="about-footer">
        <p>&copy; {new Date().getFullYear()} Mystic Flora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
