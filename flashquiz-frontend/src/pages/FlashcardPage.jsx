import React, { useState } from 'react';
import decks from '../data/decks';
import Flashcard from '../components/Flashcard';
import './FlashcardPage.css';

function FlashcardPage({ user }) {
  const [selectedSuit, setSelectedSuit] = useState('spades');
  const [cards, setCards] = useState([...decks['spades']]);
  const [current, setCurrent] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleSuitChange = (suit) => {
    setSelectedSuit(suit);
    const shuffled = [...decks[suit]];
    setCards(shuffled);
    setCurrent(0);
    setShowAll(false);
  };

  const nextCard = () => setCurrent((prev) => (prev + 1) % cards.length);
  const prevCard = () => setCurrent((prev) => (prev - 1 + cards.length) % cards.length);
  const shuffleDeck = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrent(0);
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="arcade-title" style={{ color: 'gray', textAlign: 'center' }}>♠️ FlashQuizApp ♥️</h1>
        <p className="tagline">Welcome, <strong>{user}</strong> 👋</p>
      </header>

      {/* 🎴 Suit Selection Cards */}
      <div className="suit-split-layout">
        <div className="suit-side left">
          <div className="suit-card" onClick={() => handleSuitChange('spades')}>
            <span className="suit-icon">♠</span>
            <h3>Spades</h3>
            <p>Physical & Action-Oriented Knowledge</p>
          </div>
          <div className="suit-card" onClick={() => handleSuitChange('hearts')}>
            <span className="suit-icon">♥</span>
            <h3>Hearts</h3>
            <p>Emotional & Psychological Knowledge</p>
          </div>
        </div>

        <div className="suit-side right">
          <div className="suit-card" onClick={() => handleSuitChange('diamonds')}>
            <span className="suit-icon">♦</span>
            <h3>Diamonds</h3>
            <p>Intellectual & Strategic Knowledge</p>
          </div>
          <div className="suit-card" onClick={() => handleSuitChange('clubs')}>
            <span className="suit-icon">♣</span>
            <h3>Clubs</h3>
            <p>Balanced & Social Knowledge</p>
          </div>
        </div>
      </div>

      {/* 🔁 Deck Controls */}
      <div className="deck-toolbar">
        <button onClick={shuffleDeck}>🔀 Shuffle</button>
        <button onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? '📇 Hide All Cards' : '📇 Show All Cards'}
        </button>
      </div>

      {/* 🧠 Flashcard Area */}
      {!showAll ? (
        <div className="flashcard-zone">
          <div className="flashcard-wrapper">
            <Flashcard
              front={cards[current].front}
              back={cards[current].back}
              suit={selectedSuit}
              rank={cards[current].rank}
            />
          </div>
          <div className="nav-buttons">
            <button onClick={prevCard}>⬅️ Prev</button>
            <span className="card-counter">
              Card {current + 1} / {cards.length}
            </span>
            <button onClick={nextCard}>Next ➡️</button>
          </div>
        </div>
      ) : (
        <div className="card-gallery">
          {cards.map((card, index) => (
            <Flashcard
              key={index}
              front={card.front}
              back={card.back}
              suit={selectedSuit}
              rank={card.rank}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardPage;












