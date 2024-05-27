// routes/cards.js
const express = require('express');
const router = express.Router();
const db = require('../db');


// GET the 20 most recently published cards
router.get('/latest', async (req, res) => {
  try {
    const query = `
      SELECT id, name,TO_BASE64(image) AS image, published_date, series_id, rarity_id, obtain, is_japan_expo, url_nv, ean
      FROM cards
      ORDER BY published_date DESC
      LIMIT 20`;

    const [results] = await db.execute(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all cards
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT id, name, published_date, series_id, rarity_id, obtain, is_japan_expo, url_nv, ean FROM cards');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET card by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.execute('SELECT id,TO_BASE64(image) AS image, name, published_date, series_id, rarity_id, obtain, is_japan_expo, url_nv, ean FROM cards WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
