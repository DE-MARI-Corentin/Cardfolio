// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Routes pour chaque table
const cardsRouter = require('./routes/cards');
const collectionsRouter = require('./routes/collections');
const followsRouter = require('./routes/follows');
const raritiesRouter = require('./routes/rarities');
const seriesRouter = require('./routes/series');
const settingsRouter = require('./routes/settings');
const userRouter = require('./routes/users');

app.use('/api/cards', cardsRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/follows', followsRouter);
app.use('/api/rarities', raritiesRouter);
app.use('/api/series', seriesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', userRouter);

// Handle 404 - Route not found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
