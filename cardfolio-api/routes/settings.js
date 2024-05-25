const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all settings
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT id, theme, exchange FROM settings');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET setting by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.execute('SELECT id, theme, exchange FROM settings WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
