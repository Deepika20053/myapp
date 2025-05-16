import React, { useState, useEffect } from 'react';
import Login from './login';
import Contact from './Footer';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://stock-portfolio-tracker-kcf8.onrender.com/api/stocks');
      if (!response.ok) throw new Error('Failed to fetch stocks');
      const data = await response.json();
      setStocks(data.stocks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStocks();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stockData = {
      symbol,
      companyName,
      quantity: parseInt(quantity, 10),
      purchasePrice: parseFloat(price),
    };

    try {
      const response = await fetch('https://stock-portfolio-tracker-kcf8.onrender.com/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockData),
      });

      if (!response.ok) throw new Error('Failed to add stock');
      const result = await response.json();

      setSuccessMsg('✅ Stock added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);

      setSymbol('');
      setCompanyName('');
      setQuantity('');
      setPrice('');
      fetchStocks();
    } catch (error) {
      console.error('🚨 Error:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://stock-portfolio-tracker-kcf8.onrender.com/api/stocks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete stock');
      setSuccessMsg('🗑️ Stock deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchStocks();
    } catch (error) {
      console.error('❌ Error deleting stock:', error.message);
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📈 Deep Stock Portfolio Manager</h1>
        <p>Track and manage your investments effortlessly.</p>
      </header>

      <main className="app-main">
        <form className="stock-form" onSubmit={handleSubmit}>
          {successMsg && <p className="success-message">{successMsg}</p>}
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

        <div style={{ height: '100vh' }}></div> {/* Scroll spacer */}

        <section id="stocks" className="stock-list">
          <h2>Your Stocks</h2>
