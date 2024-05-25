const express = require('express');
const router = express.Router();
const db = require('../db');

// GET statistics for a user's collection
router.get('/:id/stats', async (req, res) => {
  const { id } = req.params;
  try {
    const [totalCardsResult] = await db.execute('SELECT COUNT(*) AS total_cards FROM collections WHERE user_id = ?', [id]);
    const totalCards = totalCardsResult[0].total_cards;

    const [totalCardsInDatabaseResult] = await db.execute('SELECT COUNT(*) AS total_cards FROM cards');
    const totalCardsInDatabase = totalCardsInDatabaseResult[0].total_cards;

    const percentageOwned = (totalCards / totalCardsInDatabase) * 100;
    const percentageMissing = 100 - percentageOwned;

    res.json({
      total_cards_owned: totalCards,
      total_cards_in_database: totalCardsInDatabase,
      percentage_owned: percentageOwned.toFixed(2),
      percentage_missing: percentageMissing.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT id, setting_id, username, mail, prenium FROM user');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.execute('SELECT id, setting_id, username, mail, prenium FROM user WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
