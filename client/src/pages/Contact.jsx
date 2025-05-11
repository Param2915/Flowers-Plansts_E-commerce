import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', {
        name,
        email,
        occasion,
        budget,
        message
      });
      toast.success('Your message has been sent!');
      // Clear form after successful submission
      setName('');
      setEmail('');
      setOccasion('');
      setBudget('');
      setMessage('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="contact-wrapper">
      <ToastContainer />
      <section className="contact-header">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you. Reach out with any questions, feedback, or just to say hello!
          </p>

          <div className="contact-details">
            <p><strong>Address:</strong> 456 Mystic Avenue, San Francisco, CA</p>
            <p><strong>Phone:</strong> +1 (415) 555-6789</p>
            <p><strong>Email:</strong> hello@mysticflora.com</p>
            <div className="social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-pinterest-p"></i>
            </div>
          </div>
        </div>

        <div className="contact-image">
          <img
            src="https://images.unsplash.com/photo-1739458531017-1e9dfe219504?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg1fHx8ZW58MHx8fHx8"
            alt="Contact Decor"
          />
        </div>
      </section>

      <section className="contact-form-section">
        <h2>Get In Touch</h2>
        <p>
          Fill out the form below and we’ll get back to you as soon as possible.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Name" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Occasion" 
              value={occasion} 
              onChange={(e) => setOccasion(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Budget (optional)" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
            />
          </div>
          <textarea 
            placeholder="Message" 
            rows="5" 
            required 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit" className="send-button">Send Request</button>
        </form>
      </section>

      <section className="map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086544333272!2d-122.42067928467706!3d37.77902667975806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c12ab29cf%3A0x503d1b47779fba38!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1615463181234!5m2!1sen!2sus"
          width="100%"
          height="400"
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
        ></iframe>
      </section>

      <footer className="contact-footer">
        <p>&copy; {new Date().getFullYear()} Mystic Flora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
