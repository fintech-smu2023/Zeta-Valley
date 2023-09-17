const express = require('express');
const app = express();
const port = 3000;

// Constants.
const oneDay = 24 * 60 * 60 * 1000;

// Load environment variables.
require('dotenv').config();

// Connect to MongoDB.
const MongoClient = require('mongodb').MongoClient;
let mongoClient = new MongoClient(process.env.MONGODB_URI);
const database = mongoClient.db('zeta_valley');
mongoClient.connect();

// Middleware to parse JSON bodies.
app.use(express.json());

// Parse urlencoded request body.
app.use(express.urlencoded({ extended: true }));

// GET income statement.
app.get('/:ticker/incomestatement', async (req, res, next) => {
  let ticker = req.params.ticker;

  try {
    let collection = database.collection('incomestatement');

    let incomeStatement = await collection.findOne({ symbol: ticker });

    if (incomeStatement) {
      let dataAge = new Date() - new Date(incomeStatement.timestamp);

      if (dataAge < oneDay) {
        res.json(incomeStatement);
        return;
      }
    }

    let alphavantage = await fetch(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo`);
    let data = await alphavantage.json();

    data.timestamp = new Date();

    if (incomeStatement) {
      collection.updateOne({ symbol: ticker }, { $set: data });
    } else {
      collection.insertOne(data);
      collection.createIndex({ symbol: 'text' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET balance sheet.
app.get('/:ticker/balancesheet', async (req, res, next) => {
  let ticker = req.params.ticker;

  try {
    let collection = database.collection('balancesheet');

    let balanceSheet = await collection.findOne({ symbol: ticker });

    if (balanceSheet) {
      let dataAge = new Date() - new Date(balanceSheet.timestamp);

      if (dataAge < oneDay) {
        res.json(balanceSheet);
        return;
      }
    }

    let alphavantage = await fetch('https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=IBM&apikey=demo');
    let data = await alphavantage.json();

    data.timestamp = new Date();

    if (balanceSheet) {
      collection.updateOne({ symbol: ticker }, { $set: data });
    } else {
      collection.insertOne(data);
      collection.createIndex({ symbol: 'text' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET cash flow.
app.get('/:ticker/cashflow', async (req, res, next) => {
  let ticker = req.params.ticker;

  try {
    let collection = database.collection('cashflow');

    let cashFlow = await collection.findOne({ symbol: ticker });

    if (cashFlow) {
      let dataAge = new Date() - new Date(cashFlow.timestamp);

      if (dataAge < oneDay) {
        res.json(cashFlow);
        return;
      }
    }

    let alphavantage = await fetch('https://www.alphavantage.co/query?function=CASH_FLOW&symbol=IBM&apikey=demo');
    let data = await alphavantage.json();

    data.timestamp = new Date();

    if (cashFlow) {
      collection.updateOne({ symbol: ticker }, { $set: data });
    } else {
      collection.insertOne(data);
      collection.createIndex({ symbol: 'text' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }  
});

// 404 handling middleware.
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// 500 handling middleware.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start app.
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
