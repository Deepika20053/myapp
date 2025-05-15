// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import schedule from 'node-schedule';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Schema
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  purchasePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

stockSchema.virtual('totalValue').get(function () {
  return this.quantity * this.currentPrice;
});
stockSchema.virtual('profitLoss').get(function () {
  return (this.currentPrice - this.purchasePrice) * this.quantity;
});
stockSchema.virtual('profitLossPercentage').get(function () {
  return ((this.currentPrice - this.purchasePrice) / this.purchasePrice) * 100;
});

const Stock = mongoose.model('Stock', stockSchema);

// Simulate price updates
function simulateStockPrice(basePrice) {
  const changePercent = (Math.random() - 0.5) * 2; // -1% to +1%
  return basePrice * (1 + changePercent / 100);
}

schedule.scheduleJob('*/1 * * * *', async () => {
  try {
    const stocks = await Stock.find();
    for (const stock of stocks) {
      stock.currentPrice = simulateStockPrice(stock.currentPrice);
      stock.lastUpdated = new Date();
      await stock.save();
      io.emit('priceUpdate', {
        symbol: stock.symbol,
        price: stock.currentPrice,
        lastUpdated: stock.lastUpdated
      });
    }
  } catch (error) {
    console.error('Error updating stock prices:', error);
  }
});

// Routes
app.post('/api/stocks', async (req, res) => {
  try {
    const { symbol, companyName, quantity, purchasePrice } = req.body;
    const stock = new Stock({
      symbol,
      companyName,
      quantity,
      purchasePrice,
      currentPrice: purchasePrice
    });
    await stock.save();
    io.emit('newStock', stock);
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create stock' });
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    const totalValue = stocks.reduce((sum, stock) => sum + stock.totalValue, 0);
    const totalProfitLoss = stocks.reduce((sum, stock) => sum + stock.profitLoss, 0);
    const percentage = totalValue !== 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0;
    res.json({
      stocks,
      portfolioSummary: {
        totalValue,
        totalProfitLoss,
        profitLossPercentage: percentage
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

app.put('/api/stocks/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const stock = await Stock.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    io.emit('stockUpdate', stock);
    res.json(stock);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update stock' });
  }
});

app.delete('/api/stocks/:id', async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    io.emit('stockDelete', req.params.id);
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete stock' });
  }
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('👤 Client connected');
  socket.on('disconnect', () => {
    console.log('👋 Client disconnected');
  });
});

// Health route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    lastUpdate: new Date()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Stock Portfolio Tracker API is running',
    endpoints: {
      health: '/health',
      stocks: '/api/stocks'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔄 Real-time updates enabled`);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    mongoose.connection.close(false, () => {
      console.log('💫 Process terminated');
      process.exit(0);
    });
  });
});
