const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all series
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT id, name, autheur, code, synopsis FROM series');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET series by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.execute('SELECT id,TO_BASE64(image) AS image, name, autheur, code, synopsis FROM series WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Series not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET cards by series_id
router.get('/:seriesId/cards', async (req, res) => {
  const { seriesId } = req.params;
  try {
    const [results] = await db.execute('SELECT id,TO_BASE64(image) AS image, name, published_date, rarity_id, obtain, is_japan_expo, url_nv, ean FROM cards WHERE series_id = ?', [seriesId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
