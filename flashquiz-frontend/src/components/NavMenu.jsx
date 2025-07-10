import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavMenu.css';

function NavMenu({ sidebarOpen, setSidebarOpen, theme, toggleTheme }) {
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false); // close sidebar on route change
  }, [location.pathname]);

  return (
    <>
      <header className="topbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setSidebarOpen(prev => !prev)}>☰</button>
        </div>
        <div className="nav-right">
          <Link to="/">Flashcards</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/create">Create</Link>
          <Link to="/about">About</Link>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <aside className="sidebar">
          <h2>✨ Features</h2>
          <ul>
            <li>🃏 Flip animation</li>
            <li>🎨 Theme toggle</li>
            <li>🔀 Shuffle & filters</li>
            <li>🧠 Add cards</li>
          </ul>
        </aside>
      )}
    </>
  );
}

export default NavMenu;
