import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import RoomLobby from "./pages/RoomLobby";
import Results from "./pages/Results";
import Memories from "./pages/Memories";
import { ThemeProvider } from "./ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import "./styles/global.css";

// Snowflakes component
const Snowflakes = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 12 + 3,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 15,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snowflakes">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

// ChristmasLights component
const ChristmasLights = () => {
  return (
    <div className="lights">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="light" />
      ))}
    </div>
  );
};

// Main App component wrapped with AppProvider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

// Separate component that uses hooks
function AppContent() {
  const { currentRoom, currentUser } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="snowfall"></div>
        <div className="loading-content">
          <div className="santa-hat">🎅</div>
          <h2>Loading Christmas Magic...</h2>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div id="app-root" className="christmas-theme">
          <div className="snowflakes" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="snowflake">❅</div>
            ))}
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route 
              path="/room/:roomCode" 
              element={currentRoom ? <RoomLobby /> : <Navigate to="/" />} 
            />
            <Route 
              path="/results/:roomCode" 
              element={currentUser ? <Results /> : <Navigate to="/" />} 
            />
            <Route path="/memories" element={<Memories />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
