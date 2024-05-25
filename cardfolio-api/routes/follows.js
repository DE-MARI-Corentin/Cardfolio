const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all follows
router.get('/', async (req, res) => {
  try {
    const [results] = await db.execute('SELECT * FROM follows');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer la liste des séries suivies par un utilisateur
router.get('/series/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Récupérer les séries suivies par l'utilisateur (distinctes)
    const [series] = await db.execute('SELECT DISTINCT series_id FROM follows JOIN cards ON follows.card_id = cards.id WHERE follows.user_id = ?', [userId]);

    // Récupérer les détails des séries suivies (sans les colonnes blob)
    const seriesDetailsPromises = series.map(async seriesId => {
      const [seriesDetails] = await db.execute('SELECT id, name, autheur, code, synopsis FROM series WHERE id = ?', [seriesId.series_id]);
      return seriesDetails[0];
    });

    const seriesDetails = await Promise.all(seriesDetailsPromises);
    
    res.status(200).json(seriesDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET follows by user_id
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.execute('SELECT * FROM follows WHERE user_id = ?', [userId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter une carte à la liste de suivi d'un utilisateur
router.post('/:userId/:cardId', async (req, res) => {
  const { userId, cardId } = req.params;
  const { type } = req.body;
  
  try {
    // Ajouter la carte à la liste de suivi de l'utilisateur
    await db.execute('INSERT INTO follows (card_id, user_id, type) VALUES (?, ?, ?)', [cardId, userId, type]);
    
    res.status(201).json({ message: 'Card added to user follows list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une carte de la liste de suivi d'un utilisateur
router.delete('/:userId/:cardId', async (req, res) => {
  const { userId, cardId } = req.params;
  
  try {
    // Supprimer la carte de la liste de suivi de l'utilisateur
    await db.execute('DELETE FROM follows WHERE user_id = ? AND card_id = ?', [userId, cardId]);
    
    res.status(200).json({ message: 'Card removed from user follows list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter toutes les cartes d'une série à la liste de suivi d'un utilisateur
router.post('/series/:userId/:seriesId', async (req, res) => {
  const { userId, seriesId } = req.params;
  
  try {
    // Récupérer toutes les cartes de la série
    const [cards] = await db.execute('SELECT id FROM cards WHERE series_id = ?', [seriesId]);
    
    // Ajouter chaque carte à la liste de suivi de l'utilisateur
    const promises = cards.map(async card => {
      const cardId = card.id;
      const type = 'series'; // Vous pouvez ajuster le type selon vos besoins
      await db.execute('INSERT INTO follows (card_id, user_id, type) VALUES (?, ?, ?)', [cardId, userId, type]);
    });

    // Attendre que toutes les cartes soient ajoutées
    await Promise.all(promises);
    
    res.status(201).json({ message: 'All cards from series added to user follows list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer toutes les cartes d'une série de la liste de suivi d'un utilisateur
router.delete('/series/:userId/:seriesId', async (req, res) => {
  const { userId, seriesId } = req.params;
  
  try {
    // Supprimer toutes les cartes de la série de la liste de suivi de l'utilisateur
    await db.execute('DELETE FROM follows WHERE user_id = ? AND card_id IN (SELECT id FROM cards WHERE series_id = ?)', [userId, seriesId]);
    
    res.status(200).json({ message: 'All cards from series removed from user follows list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
