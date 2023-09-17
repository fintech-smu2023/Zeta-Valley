const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies.
app.use(express.json());

// Parse urlencoded request body.
app.use(express.urlencoded({ extended: true }));

// GET income statement.
app.get('/:ticker/incomestatement', async (req, res, next) => {
  let ticker = req.params.ticker;

  try {
    let alphavantage = await fetch('https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=demo');
    let data = await alphavantage.json();
  } catch (err) {
    next(err);
  }
  
  res.json(data);
});

// GET balance sheet.
app.get('/:ticker/balancesheet', async (req, res, next) => {
  let ticker = req.params.ticker;

  try {
    let alphavantage = await fetch('https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=IBM&apikey=demo');
    let data = await alphavantage.json();
  } catch (err) {
    next(err);
  }
  
  res.json(data);
});

// GET cash flow.
app.get('/:ticker/cashflow', async (req, res, next) => {
  let ticker = req.params.ticker;

  try {
    let alphavantage = await fetch('https://www.alphavantage.co/query?function=CASH_FLOW&symbol=IBM&apikey=demo');
    let data = await alphavantage.json();
  } catch (err) {
    next(err);
  }

  res.json(data);
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