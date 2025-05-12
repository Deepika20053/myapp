// src/App.js
import React, { useState } from 'react';
import Login from './login';
import Contact from './Footer';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stockData = {
      symbol,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
    };
    console.log('Submitted Stock Data:', stockData);
    setSymbol('');
    setQuantity('');
    setPrice('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📈  Deep Stock Portfolio Manager</h1>
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
            <label htmlFor="price">Price:</label>
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
        {/* Include the Contact component */}
        <Contact />
      </main>
      <footer className="app-footer">
        <p>© 2025 stock portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
