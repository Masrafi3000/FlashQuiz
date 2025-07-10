import React, { useState, useEffect } from 'react';
import { FaHome, FaQuestion, FaPlus, FaTrash, FaCheck, FaArrowRight, FaPlay, FaTrashAlt, FaFileExport, FaFileImport, FaImage } from 'react-icons/fa';
import './CreateCardPage.css';

function CreateCardPage() {
  const [cards, setCards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [showTest, setShowTest] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [addButtonFeedback, setAddButtonFeedback] = useState(false);
  const [clearButtonFeedback, setClearButtonFeedback] = useState(false);

  // Enhanced loading with image support
  useEffect(() => {
    const loadCards = () => {
      let loadedCards = null;
      
      // Try localStorage first
      try {
        const saved = localStorage.getItem('flashcards');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.every(card => 
            typeof card === 'object' && 
            card !== null && 
            ('front' in card || 'frontImage' in card) && 
            ('back' in card || 'backImage' in card)
          )) {
            loadedCards = parsed;
          }
        }
      } catch (e) {
        console.error('LocalStorage parse error:', e);
        localStorage.removeItem('flashcards');
      }
      
      // Then try sessionStorage
      if (!loadedCards) {
        try {
          const backup = sessionStorage.getItem('flashcards-backup');
          if (backup) {
            const parsed = JSON.parse(backup);
            if (Array.isArray(parsed)) loadedCards = parsed;
          }
        } catch (e) { /* ignore */ }
      }
      
      // Finally try cookies as last resort
      if (!loadedCards) {
        try {
          const cookie = document.cookie.split('; ')
            .find(row => row.startsWith('flashcards='));
          if (cookie) {
            const value = cookie.split('=')[1];
            loadedCards = JSON.parse(decodeURIComponent(value));
          }
        } catch (e) { /* ignore */ }
      }
      
      if (loadedCards && Array.isArray(loadedCards)) {
        setCards(loadedCards);
        console.log('Loaded cards:', loadedCards);
      }
    };

    loadCards();
  }, []);

  // Robust saving with image support
  useEffect(() => {
    const saveCards = () => {
      if (cards.length === 0) return;
      
      const data = JSON.stringify(cards);
      
      try {
        localStorage.setItem('flashcards', data);
        console.log('Saved to localStorage');
      } catch (error) {
        console.error('LocalStorage error:', error);
        try {
          sessionStorage.setItem('flashcards-backup', data);
          console.log('Saved to sessionStorage');
        } catch (e) {
          console.error('SessionStorage error:', e);
          document.cookie = `flashcards=${encodeURIComponent(data)}; max-age=${60*60*24*7}`;
          console.log('Saved to cookie');
        }
      }
    };

    saveCards();
  }, [cards]);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (setImage) => {
    setImage(null);
  };

  const addCard = () => {
    if ((!front.trim() && !frontImage) || (!back.trim() && !backImage)) {
      alert('Please add at least a question (text or image) and an answer (text or image)');
      return;
    }

    const newCard = {
      front: front.trim(),
      back: back.trim(),
      ...(frontImage && { frontImage }),
      ...(backImage && { backImage })
    };

    const updated = [...cards, newCard];
    setCards(updated);
    setFront('');
    setBack('');
    setFrontImage(null);
    setBackImage(null);
    
    setAddButtonFeedback(true);
    setTimeout(() => setAddButtonFeedback(false), 1500);
  };

  const deleteCard = (i) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      const updated = [...cards];
      updated.splice(i, 1);
      setCards(updated);
      if (quizIndex >= i && quizIndex > 0) {
        setQuizIndex((prev) => prev - 1);
      }
    }
  };

  const clearAll = () => {
    if (cards.length === 0) {
      alert('No flashcards to clear.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete ALL flashcards? This cannot be undone.')) {
      setCards([]);
      setQuizIndex(0);
      setUserAnswer('');
      setShowTest(false);
      setResultMessage('');
      
      // Clear from all storage locations
      localStorage.removeItem('flashcards');
      sessionStorage.removeItem('flashcards-backup');
      document.cookie = 'flashcards=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      setClearButtonFeedback(true);
      setTimeout(() => setClearButtonFeedback(false), 1500);
    }
  };

  const exportCards = () => {
    if (cards.length === 0) {
      alert('No flashcards to export.');
      return;
    }
    
    const data = JSON.stringify(cards, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const importCards = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported) && imported.every(card => 
          typeof card === 'object' && 
          card !== null && 
          (('front' in card || 'frontImage' in card) && 
          ('back' in card || 'backImage' in card))
        )) {
          if (window.confirm(`Import ${imported.length} flashcards? This will replace your current set.`)) {
            setCards(imported);
          }
        } else {
          alert('Invalid file format - must be an array of flashcard objects with front/back text or images');
        }
      } catch (err) {
        alert('Error parsing file - invalid JSON');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const startTest = () => {
    if (cards.length === 0) {
      alert('Please create some flashcards first.');
      return;
    }
    setQuizIndex(0);
    setUserAnswer('');
    setResultMessage('');
    setShowTest(true);
    setIsFlipped(false);
  };

  const checkAnswer = () => {
    if (!cards[quizIndex].back && !cards[quizIndex].backImage) {
      setResultMessage('This card has no text answer to check against');
      return;
    }
    
    if (cards[quizIndex].backImage) {
      setResultMessage('This card has an image answer - flip the card to check');
      return;
    }

    const correct = cards[quizIndex].back.trim().toLowerCase();
    const answer = userAnswer.trim().toLowerCase();
    if (answer === correct) {
      setResultMessage('Correct!');
    } else {
      setResultMessage(`Incorrect. The correct answer is: ${cards[quizIndex].back}`);
    }
  };

  const nextCard = () => {
    if (quizIndex + 1 < cards.length) {
      setQuizIndex(quizIndex + 1);
      setUserAnswer('');
      setResultMessage('');
      setIsFlipped(false);
    } else {
      alert('You have completed all flashcards!');
      setShowTest(false);
    }
  };

  const toggleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Create Flashcards</h1>
        <div className="mode-toggle">
          <a href="/" className="mode-btn"><FaHome /> Home</a>
          <button onClick={startTest} className="mode-btn"><FaQuestion /> Quiz</button>
        </div>
      </header>

      <div className="main-content">
        <div className="flashcard-management">
          <h2>Create New Flashcard</h2>
          
          <div className="form-group">
            <label htmlFor="frontText">Question/Term (Text or Image)</label>
            <textarea 
              id="frontText" 
              rows="3" 
              placeholder="Enter question or term (or upload image below)" 
              value={front} 
              onChange={(e) => setFront(e.target.value)} 
            />
            <div className="image-upload-container">
              <label className="image-upload-btn">
                <FaImage /> Upload Question Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, setFrontImage)}
                  style={{ display: 'none' }}
                />
              </label>
              {frontImage && (
                <div className="image-preview-container">
                  <img src={frontImage} alt="Question preview" className="image-preview" />
                  <button 
                    onClick={() => clearImage(setFrontImage)} 
                    className="clear-image-btn"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="backText">Answer/Definition (Text or Image)</label>
            <textarea 
              id="backText" 
              rows="3" 
              placeholder="Enter answer or definition (or upload image below)" 
              value={back} 
              onChange={(e) => setBack(e.target.value)} 
            />
            <div className="image-upload-container">
              <label className="image-upload-btn">
                <FaImage /> Upload Answer Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, setBackImage)}
                  style={{ display: 'none' }}
                />
              </label>
              {backImage && (
                <div className="image-preview-container">
                  <img src={backImage} alt="Answer preview" className="image-preview" />
                  <button 
                    onClick={() => clearImage(setBackImage)} 
                    className="clear-image-btn"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="management-buttons">
            <button 
              onClick={addCard} 
              className={`primary-btn ${addButtonFeedback ? 'success-feedback' : ''}`}
            >
              {addButtonFeedback ? <FaCheck /> : <FaPlus />} 
              {addButtonFeedback ? 'Added!' : 'Add Flashcard'}
            </button>
            <button 
              onClick={clearAll} 
              className={`danger-btn ${clearButtonFeedback ? 'success-feedback' : ''}`}
            >
              {clearButtonFeedback ? <FaCheck /> : <FaTrash />} 
              {clearButtonFeedback ? 'Cleared!' : 'Clear All'}
            </button>
            <button 
              onClick={exportCards} 
              className="primary-btn"
            >
              <FaFileExport /> Export
            </button>
            <label className="primary-btn file-import-btn">
              <FaFileImport /> Import
              <input 
                type="file" 
                accept=".json" 
                onChange={importCards}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          <div className="stats">
            <p>Total Cards: <strong>{cards.length}</strong></p>
          </div>

          <div className="card-list">
            {cards.length === 0 ? (
              <p id="noCardsMessage">No flashcards created yet</p>
            ) : (
              cards.map((card, index) => (
                <div className="card-item" key={index}>
                  <div className="card-content">
                    <strong>Q:</strong> 
                    {card.frontImage ? (
                      <img src={card.frontImage} alt="Question" className="card-thumbnail" />
                    ) : (
                      card.front
                    )}
                    <br />
                    <strong>A:</strong> 
                    {card.backImage ? (
                      <img src={card.backImage} alt="Answer" className="card-thumbnail" />
                    ) : (
                      card.back
                    )}
                  </div>
                  <div className="card-actions">
                    <button 
                      className="delete-card-btn" 
                      onClick={() => deleteCard(index)}
                      title="Delete this card"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="test-section">
            <h2>Test Yourself</h2>
            {showTest && cards.length > 0 ? (
              <div className="test-container">
                <div 
                  className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
                  onClick={toggleCardFlip}
                >
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      <div className="flashcard-content">
                        {cards[quizIndex].frontImage ? (
                          <img src={cards[quizIndex].frontImage} alt="Question" className="test-image" />
                        ) : (
                          cards[quizIndex].front
                        )}
                      </div>
                    </div>
                    <div className="flashcard-back">
                      <div className="flashcard-content">
                        {cards[quizIndex].backImage ? (
                          <img src={cards[quizIndex].backImage} alt="Answer" className="test-image" />
                        ) : (
                          cards[quizIndex].back
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {!cards[quizIndex].backImage && (
                  <div style={{ marginTop: '20px' }}>
                    <input
                      type="text"
                      className="answer-input"
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <button onClick={checkAnswer} className="check-answer-btn">
                      Check Answer
                    </button>
                    {resultMessage && (
                      <div className={`result-message ${
                        resultMessage.includes('Correct') ? 'correct' : 'incorrect'
                      }`}>
                        {resultMessage}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="management-buttons" style={{ marginTop: '20px' }}>
                  <button onClick={nextCard} className="primary-btn">
                    <FaArrowRight /> Next Card
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={startTest} className="primary-btn" style={{ marginTop: '20px' }}>
                <FaPlay /> Start Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCardPage;