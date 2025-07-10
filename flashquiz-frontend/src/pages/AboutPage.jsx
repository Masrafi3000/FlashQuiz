import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaGlobe } from 'react-icons/fa';
import './AboutPage.css';

function AboutPage() {
  const [flippedCards, setFlippedCards] = useState({
    about: false,
    tech: false,
    usage: false,
    contact: false
  });

  const toggleCard = (card) => {
    setFlippedCards(prev => ({
      ...prev,
      [card]: !prev[card]
    }));
  };

  return (
    <div className="about-container">
      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-image-container">
          <img src="/images/masrafi.jpg.png" alt="Profile" className="profile-image" />
        </div>
        
        <div className="social-cards">
          <a href="https://github.com/Masrafi3000" className="social-card github" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/makdum-masrafi-930ab3329/" className="social-card linkedin" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="social-icon" />
            <span>LinkedIn</span>
          </a>
          <a href="https://www.facebook.com/masrafi.islam.92" className="social-card facebook" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="social-icon" />
            <span>Facebook</span>
          </a>
          <a href="https://masrafi3000.github.io/mashrafi-s-portfolio/" className="social-card portfolio" target="_blank" rel="noopener noreferrer">
            <FaGlobe className="social-icon" />
            <span>Portfolio</span>
          </a>
        </div>
      </section>

      {/* Flip Cards Section */}
      <section className="flip-cards-section">
        {/* About Card */}
        <div 
          className={`flip-card ${flippedCards.about ? 'flipped' : ''}`}
          onClick={() => toggleCard('about')}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <h3>About</h3>
              <p>Click to learn more</p>
            </div>
            <div className="flip-card-back">
              <h3>About Me</h3>
              <p>Full-stack developer passionate about creating interactive web experiences.</p>
            </div>
          </div>
        </div>

        {/* Tech Stack Card */}
        <div 
          className={`flip-card ${flippedCards.tech ? 'flipped' : ''}`}
          onClick={() => toggleCard('tech')}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <h3>Tech Stack</h3>
              <p>Click to see technologies</p>
            </div>
            <div className="flip-card-back">
              <h3>My Tech</h3>
              <p>React, Node.js, MongoDB, CSS3</p>
            </div>
          </div>
        </div>

        {/* How to Use Card - Updated with concise instructions */}
        <div 
          className={`flip-card ${flippedCards.usage ? 'flipped' : ''}`}
          onClick={() => toggleCard('usage')}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <h3>How to Use</h3>
              <p>Click for instructions</p>
            </div>
            <div className="flip-card-back">
              <h4>Quick Guide</h4>
              <p>➕ Create Flashcards</p>
              <p>♠♥♦♣ Choose Suit Deck</p>
              <p>▶️ Quiz Yourself</p>
              <p>✅❌ Track Accuracy</p>
              <p>📊 Flip Stats</p>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div 
          className={`flip-card ${flippedCards.contact ? 'flipped' : ''}`}
          onClick={() => toggleCard('contact')}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <h3>Contact</h3>
              <p>Click for details</p>
            </div>
            <div className="flip-card-back">
              <h3>Contact Me</h3>
              <p>Email: makdummasrafi@gmail.com</p>
              <p>Phone: 01762194489</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cards */}
      <section className="floating-cards-section">
        <div className="floating-card spade">♠</div>
        <div className="floating-card diamond">♦</div>
        <div className="floating-card heart">♥</div>
        <div className="floating-card club">♣</div>
      </section>
    </div>
  );
}

export default AboutPage;