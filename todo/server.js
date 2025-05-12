const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
import path from "path";  // To load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const _dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON bodies


mongoose.connect('mongodb://localhost:27017/mer-app')
.then(()=>{
    console.log('DB CONNECTTED!')
})
.catch((err)=>{
    console.log(error)
})

// Stock Schema (Define the stock structure)
const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});
const Stock = mongoose.model('Stock', StockSchema);

// POST: Add a new stock to the portfolio
app.post('/api/stocks', async (req, res) => {
  const { symbol, quantity, price } = req.body;
  try {
    const newStock = new Stock({ symbol, quantity, price });
    await newStock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: 'Error saving stock', error: err });
  }
});


// GET: Fetch all stocks in the portfolio
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();  // Get all stocks from MongoDB
    res.json(stocks);  // Return the stocks as a response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stocks', error: err });
  }
});

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('✅ Stock Portfolio Tracker API is running by the author of this application DEEPIKA.');
});
if(process.env.NODE_ENV == "production"){
  app.use(express.static(path.join(_dirname,"/todofrontend/src")));

  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname,"todofrontend","src","index.js"))
  })
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
