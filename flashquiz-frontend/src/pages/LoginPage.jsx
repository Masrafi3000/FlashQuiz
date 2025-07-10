import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setUser }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('players');
    return saved ? JSON.parse(saved) : {};
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (players[name]) {
        setError('⚠️ Name already taken');
      } else {
        const updated = { ...players, [name]: password };
        localStorage.setItem('players', JSON.stringify(updated));
        setPlayers(updated);
        setUser(name);
        navigate('/');
      }
    } else {
      if (players[name] === password) {
        setUser(name);
        navigate('/');
      } else {
        setError('❌ Invalid name or password');
      }
    }
  };

  return (
    <div className="login-card-backdrop">
      <div className="login-card">
        <h2>{isRegistering ? '🎴 Register as Player' : '🃏 Log In to FlashQuizApp'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegistering ? 'Register' : 'Login'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="toggle-auth" onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
          {isRegistering
            ? '🔁 Already registered? Click to Login'
            : '🆕 New player? Click to Register'}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
