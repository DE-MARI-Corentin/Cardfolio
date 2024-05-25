const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all collections
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM collections');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET collections by user_id
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.execute('SELECT cards.id, cards.name, collections.quantity FROM collections JOIN cards ON collections.card_id = cards.id WHERE collections.user_id = ?', [userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET cards with quantity > 1 in user's collection
router.get('/user/:userId/quantity', async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.execute('SELECT cards.id, cards.name, collections.quantity FROM collections JOIN cards ON collections.card_id = cards.id WHERE collections.user_id = ? AND collections.quantity > 1', [userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour la quantité d'une carte dans la collection d'un utilisateur
router.put('/:userId/:cardId/:quantity', async (req, res) => {
  const { userId, cardId, quantity } = req.params;
  
  try {
    // Mettre à jour la quantité de la carte dans la collection de l'utilisateur
    await db.execute('UPDATE collections SET quantity = ? WHERE user_id = ? AND card_id = ?', [quantity, userId, cardId]);
    
    res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
