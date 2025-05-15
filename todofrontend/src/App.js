// src/App.js
import React, { useState } from 'react';
import Login from './login';
import Contact from './Footer';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stockData = {
      symbol: symbol.toUpperCase(),
      companyName,
      quantity: parseInt(quantity, 10),
      purchasePrice: parseFloat(price),
    };

    try {
      const response = await fetch('https://stock-portfolio-tracker-kcf8.onrender.com/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add stock');
      }

      const result = await response.json();
      console.log('✅ Stock added:', result);
      setMessage('Stock added successfully!');

      // Reset form
      setSymbol('');
      setCompanyName('');
      setQuantity('');
      setPrice('');
    } catch (error) {
      console.error('❌ Submission error:', error.message);
      setMessage('Error: ' + error.message);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📈 Deep Stock Portfolio Manager</h1>
        <p>Track and manage your investments effortlessly.</p>
      </header>

      <main className="app-main">
        <form className="stock-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="symbol">Stock Symbol:</label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Purchase Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Stock</button>
        </form>

        {message && <p className="status-message">{message}</p>}
        <Contact />
      </main>

      <footer className="app-footer">
        <p>© 2025 stock portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
