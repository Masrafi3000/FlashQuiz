import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlashcardPage from './pages/FlashcardPage';
import QuizPage from './pages/QuizPage';
import CreateCardPage from './pages/CreateCardPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import NavMenu from './components/NavMenu';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.body.className = theme + '-theme';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className={`layout ${sidebarOpen ? 'shifted' : ''}`}>
        <NavMenu
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="main-content">
          <Routes>
            {/* Homepage: show login if not logged in */}
            <Route
              path="/"
              element={
                user ? (
                  <FlashcardPage user={user} />
                ) : (
                  <LoginPage setUser={setUser} />
                )
              }
            />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/create" element={<CreateCardPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
