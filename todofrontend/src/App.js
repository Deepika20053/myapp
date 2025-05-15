// src/App.js
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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const fetchStocks = async () => {
    try {
      const response = await fetch('https://stock-portfolio-tracker-kcf8.onrender.com/api/stocks');
      const data = await response.json();
      setStocks(data.stocks || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

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

      if (!response.ok) {
        throw new Error('Failed to add stock');
      }

      await response.json();
      fetchStocks(); // Refresh stocks
      setSymbol('');
      setCompanyName('');
      setQuantity('');
      setPrice('');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchStocks();
  }, [isAuthenticated]);

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
        {/* Add Stock Form */}
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

        {/* View Stocks */}
        <section className="stock-view">
          <h2>📋 Your Stocks</h2>
          {stocks.length === 0 ? (
            <p>No stocks found.</p>
          ) : (
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Quantity</th>
                  <th>Buy Price</th>
                  <th>Current Price</th>
                  <th>Total Value</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock._id}>
                    <td>{stock.symbol}</td>
                    <td>{stock.companyName}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.purchasePrice}</td>
                    <td>{stock.currentPrice.toFixed(2)}</td>
                    <td>{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td>{((stock.currentPrice - stock.purchasePrice) * stock.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <Contact />
      </main>

      <footer className="app-footer">
        <p>© 2025 stock portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
