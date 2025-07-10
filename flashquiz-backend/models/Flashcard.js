const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  suit: { type: String, required: true },
  rank: { type: String, required: true }
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);
