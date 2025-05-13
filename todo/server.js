// server.js (ES module-compatible with deployment fixes)

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mer-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ DB CONNECTED'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Mongoose Schema and Model
const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Stock = mongoose.model('Stock', StockSchema);

// Routes
app.post('/api/stocks', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: 'Error saving stock', error: err });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stocks', error: err });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Stock Portfolio Tracker API is running - by Deepika.');
});

// Static assets handling for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'todofrontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'todofrontend', 'build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
