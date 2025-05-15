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
  const [message, setMessage] = useState('');

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

      setMessage('✅ Stock added successfully!');
      setTimeout(() => setMessage(''), 3000);

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
    if (!window.confirm('Are you sure you want to delete this stock?')) return;

    try {
      const response = await fetch(`https://stock-portfolio-tracker-kcf8.onrender.com/api/stocks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete stock');

      setMessage('🗑 Stock deleted successfully!');
      setTimeout(() => setMessage(''), 3000);

      setStocks(prev => prev.filter(stock => stock._id !== id));
    } catch (err) {
      console.error('Error deleting stock:', err.message);
      alert('Failed to delete stock.');
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
        {message && <div style={{ backgroundColor: '#d4edda', padding: '10px', marginBottom: '10px', color: '#155724' }}>{message}</div>}

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

        <section className="stock-list">
          <h2>Your Stocks</h2>
          {loading && <p>Loading stocks...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && stocks.length === 0 && <p>No stocks added yet.</p>}
          {stocks.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Current Price</th>
                  <th>Total Value</th>
                  <th>Profit/Loss</th>
                  <th>% Profit/Loss</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map(stock => (
                  <tr key={stock._id}>
                    <td>{stock.symbol}</td>
                    <td>{stock.companyName}</td>
                    <td>{stock.quantity}</td>
                    <td>${stock.purchasePrice.toFixed(2)}</td>
                    <td>${stock.currentPrice.toFixed(2)}</td>
                    <td>${(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td>${((stock.currentPrice - stock.purchasePrice) * stock.quantity).toFixed(2)}</td>
                    <td>{(((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100).toFixed(2)}%</td>
                    <td>
                      <button onClick={() => handleDelete(stock._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <Contact />
        <p>© 2025 stock portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
