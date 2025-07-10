import React, { useState } from 'react';
import decks from '../data/decks';
import Flashcard from '../components/Flashcard';
import './FlashcardPage.css';

function QuizPage({ user }) {
  const defaultSuit = 'spades';
  const [selectedSuit, setSelectedSuit] = useState(defaultSuit);
  const [cards, setCards] = useState([...decks[defaultSuit]]);
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(1);
  const [wrongCount, setWrongCount] = useState(99);
  const [showAll, setShowAll] = useState(false);

  const accuracy = ((correctCount / (correctCount + wrongCount)) * 100 || 0).toFixed(0);
  const acc = parseFloat(accuracy);

  const level =
    acc >= 100 ? '♠ Ace' :
    acc >= 75 ? '♦ Prodigy' :
    acc >= 50 ? '♥ Rookie' : '♣ Novice';

  const unlockedRanks = [];
  const unlockedTypes = [];

  if (acc > 0 && acc <= 30) {
    unlockedRanks.push('🃏 Number Cards');
    unlockedTypes.push('number');
  }
  if (acc > 30 && acc <= 50) {
    unlockedRanks.push('🃏 + Jack');
    unlockedTypes.push('jack');
  }
  if (acc > 50 && acc <= 60) {
    unlockedRanks.push('🃏 + Queen');
    unlockedTypes.push('queen');
  }
  if (acc > 60 && acc <= 80) {
    unlockedRanks.push('🃏 + King');
    unlockedTypes.push('king');
  }
  if (acc > 80 && acc <= 100) {
    unlockedRanks.push('🃏 + Joker');
    unlockedTypes.push('joker');
  }

  const normalizedCards = cards.map(card => {
    const r = card.rank?.toLowerCase();
    return {
      ...card,
      type: isNaN(r) ? r : 'number'
    };
  });

  const visibleCards = normalizedCards.filter(card =>
    unlockedTypes.includes(card.type)
  );

  const fallbackCard = {
    front: '🔒 No cards unlocked yet!',
    back: 'Answer correctly to unlock content!',
    suit: selectedSuit,
    rank: 'locked'
  };

  const activeCard = visibleCards.length > 0
    ? visibleCards[current % visibleCards.length]
    : fallbackCard;

  const nextCard = () => setCurrent(prev => (prev + 1) % Math.max(visibleCards.length, 1));
  const prevCard = () => setCurrent(prev => (prev - 1 + Math.max(visibleCards.length, 1)) % Math.max(visibleCards.length, 1));
  const handleCorrect = () => {
    setCorrectCount(c => c + 1);
    nextCard();
  };
  const handleWrong = () => {
    setWrongCount(w => w + 1);
    nextCard();
  };
  const handleSuitChange = (suit) => {
    const newDeck = [...decks[suit]];
    setSelectedSuit(suit);
    setCards(newDeck);
    setCurrent(0);
  };
  const shuffleDeck = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrent(0);
  };

  const suitEmoji = (suit) => {
    switch (suit) {
      case 'spades': return '♠️';
      case 'hearts': return '♥️';
      case 'diamonds': return '♦️';
      case 'clubs': return '♣️';
      default: return '🃏';
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="arcade-title">{suitEmoji(selectedSuit)} FlashQuizApp {suitEmoji(selectedSuit)}</h1>
        <p className="tagline">Welcome, <strong>{user}</strong> 👋</p>
      </header>

      <div className="deck-toolbar">
        <button onClick={shuffleDeck}>🔀 Shuffle</button>
        <button onClick={() => setShowAll(prev => !prev)}>
          {showAll ? '📇 Hide All Cards' : '📇 Show All Cards'}
        </button>
      </div>

      <div className="quiz-grid">
        <div className="reward-card">
          <h3>🎁 REWARD</h3>
          <ul>
            <li>🂠 1–30% → Number cards only</li>
            <li>🂫 30–50% → + Jack cards</li>
            <li>👸 50–60% → + Queen cards</li>
            <li>🤴 60–80% → + King cards</li>
            <li>🃏 80–100% → + Joker unlocked!</li>
          </ul>
        </div>

        <div className="quiz-column suit-side left">
          <div className="suit-card" onClick={() => handleSuitChange('spades')}>
            <span className="suit-icon">♠</span>
            <h3>Spades</h3>
            <p>Physical Knowledge</p>
          </div>
          <div className="suit-card" onClick={() => handleSuitChange('hearts')}>
            <span className="suit-icon">♥</span>
            <h3>Hearts</h3>
            <p>Emotional Knowledge</p>
          </div>
        </div>

        <div className="quiz-column quiz-center">
          <div className="answer-buttons">
            <button className="answer correct" onClick={handleCorrect}>✅ Correct</button>
            <button className="answer wrong" onClick={handleWrong}>❌ Wrong</button>
          </div>

          <div className="flashcard-wrapper">
            <Flashcard
              front={activeCard.front}
              back={activeCard.back}
              suit={activeCard.suit}
              rank={activeCard.rank}
              emoji={suitEmoji(activeCard.suit)}
            />
          </div>

          <div className="nav-buttons">
            <button onClick={prevCard}>⬅️ Prev</button>
            <span className="card-counter">
              Card {visibleCards.length > 0 ? (current % visibleCards.length) + 1 : 1} / {visibleCards.length || 1}
            </span>
            <button onClick={nextCard}>Next ➡️</button>
          </div>
        </div>

        <div className="quiz-column suit-side right">
          <div className="suit-card" onClick={() => handleSuitChange('diamonds')}>
            <span className="suit-icon">♦</span>
            <h3>Diamonds</h3>
            <p>Intellectual Knowledge</p>
          </div>
          <div className="suit-card" onClick={() => handleSuitChange('clubs')}>
            <span className="suit-icon">♣</span>
            <h3>Clubs</h3>
            <p>Social Knowledge</p>
          </div>
        </div>

        <div className="quiz-column stats-card">
          <h3>📊 STATS</h3>
          <p>🎯 Accuracy: {accuracy}%</p>
          <p>🚀 Level: {level}</p>
          <p>📑 Unlocked:<br />{unlockedRanks.join(', ') || 'None'}</p>
          <p>Total: {cards.length}</p>
          <p>✅ Correct: {correctCount}</p>
          <p>❌ Wrong: {wrongCount}</p>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
