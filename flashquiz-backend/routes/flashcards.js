const router = require('express').Router();
const Flashcard = require('../models/Flashcard');

// Get all flashcards
router.get('/', async (req, res) => {
  try {
    const cards = await Flashcard.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get flashcards' });
  }
});

// Add a new flashcard
router.post('/', async (req, res) => {
  try {
    const newCard = new Flashcard(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create flashcard' });
  }
});

// Delete a flashcard
router.delete('/:id', async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete flashcard' });
  }
});

module.exports = router;
