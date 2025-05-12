
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Information */}
        <div className="footer-section contact-info">
          <h3>Contact Us</h3>
          <p><strong> @ Name:</strong>DEEPIKA N.B.</p>
          <p><strong>📍 Address:</strong>34/1 baluchetty kanchipuram 631551</p>
          <p><strong>📞 Phone:</strong> +91 98765 43210</p>
          <p><strong>✉️ Email:</strong> deepikabhuvaneshwaran8@gmail.com</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a>Welcome to [DEEP STOCK PORTFOLIO]

Founded in [2025], our mission is to [secure and safe stock portfolio]. 

Our team, led by [deepika], is dedicated to [The people warmly]. and these principles drive us to deliver exceptional services to our clients.

Thank you for being part of our story.</li>
            <li><a href="/services">Services</a>Our Services

At [deep stock portfolio], we offer a range of services designed to [track and manage your investments effortlessly].



</li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="https://facebook.com/@deepportfolio" target="_blank" rel="noopener noreferrer">Facebook</a>https://facebook.com/@deepportfolio</li>
            <li><a href="https://twitter.com/@deepportfolio" target="_blank" rel="noopener noreferrer">Twitter</a>https://twitter.com/@deepportfolio</li>
            <li><a href="https://linkedin.com/in/@deepportfolio" target="_blank" rel="noopener noreferrer">LinkedIn</a>https://linkedin.com/in/@deepportfolio</li>
            <li><a href="https://instagram.com/@deepstockportfolio" target="_blank" rel="noopener noreferrer">Instagram</a>https://instagram.com/@deepstockportfolio</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2025 deep stock portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
