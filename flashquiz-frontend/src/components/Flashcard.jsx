import React, { useState } from 'react';
import '../styles/Flashcard.css';

function Flashcard({ front, back, suit = 'spades', rank = '?' }) {
  const [flipped, setFlipped] = useState(false);

  const suitSymbol = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
  };

  return (
    <div
      className={`flashcard ${flipped ? 'flipped' : ''} ${suit}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="card-rank">{suitSymbol[suit]} {rank}</div>
          <div className="flashcard-content">{front}</div>
          <div className="card-rank-bottom">{suitSymbol[suit]} {rank}</div>
        </div>
        <div className="flashcard-back">
          <div className="card-rank">{suitSymbol[suit]} {rank}</div>
          <div className="flashcard-content">{back}</div>
          <div className="card-rank-bottom">{suitSymbol[suit]} {rank}</div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
