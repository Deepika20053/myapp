<<<<<<< HEAD
=======
// server.js (ESM-compatible and Render deployment-ready)

>>>>>>> 269405a587ac61dd16dbce81a6cde1b9b1b8c439
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< HEAD
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
=======
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
>>>>>>> 269405a587ac61dd16dbce81a6cde1b9b1b8c439

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mer-app';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(morgan('combined')); // Request logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Body size limiting

// MongoDB Connection with proper options
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Exit if database connection fails
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Mongoose Schema with validation
const StockSchema = new mongoose.Schema({
  symbol: { 
    type: String, 
    required: true,
    trim: true,
    uppercase: true,
    minLength: 1,
    maxLength: 10
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
}, {
  timestamps: true
});

const Stock = mongoose.model('Stock', StockSchema);

// Input validation middleware
const validateStockInput = (req, res, next) => {
  const { symbol, quantity, price } = req.body;
  
  if (!symbol || typeof symbol !== 'string' || symbol.length > 10) {
    return res.status(400).json({ message: 'Invalid symbol' });
  }
  
  if (!quantity || typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }
  
  if (!price || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Invalid price' });
  }
  
  next();
};

// Routes with proper error handling
app.post('/api/stocks', validateStockInput, async (req, res) => {
  try {
    const { symbol, quantity, price } = req.body;
    const newStock = new Stock({ symbol, quantity, price });
=======
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // stop the server if DB fails
  });

// Schema & Model
const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Stock = mongoose.model('Stock', StockSchema);

// API Routes
app.post('/api/stocks', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
>>>>>>> 269405a587ac61dd16dbce81a6cde1b9b1b8c439
    await newStock.save();
    res.status(201).json({
      status: 'success',
      data: newStock
    });
  } catch (err) {
<<<<<<< HEAD
    res.status(400).json({
      status: 'error',
      message: NODE_ENV === 'production' ? 'Error saving stock' : err.message
    });
=======
    res.status(400).json({ message: 'Error saving stock', error: err.message });
>>>>>>> 269405a587ac61dd16dbce81a6cde1b9b1b8c439
  }
});

app.get('/api/stocks', async (req, res) => {
  try {
<<<<<<< HEAD
    const stocks = await Stock.find().sort({ createdAt: -1 });
    res.json({
      status: 'success',
      data: stocks
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: NODE_ENV === 'production' ? 'Error fetching stocks' : err.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.send('✅ Stock Portfolio Tracker API is running - by Deepika.');
});

// Serve frontend in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/todofrontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'todofrontend', 'build', 'index.html'));
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
=======
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stocks', error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Stock Portfolio Tracker API is running - by Deepika.');
});

// Serve static files (React frontend) in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, 'todofrontend', 'build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
>>>>>>> 269405a587ac61dd16dbce81a6cde1b9b1b8c439
});
