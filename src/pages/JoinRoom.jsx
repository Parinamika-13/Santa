import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const { joinRoom, rooms } = useApp();
  const navigate = useNavigate();
  const { roomCode: urlRoomCode } = useParams();

  // Pre-fill room code if it's in the URL
  useEffect(() => {
    if (urlRoomCode) {
      setRoomCode(urlRoomCode.toUpperCase());
    }
  }, [urlRoomCode]);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode || !userName.trim()) return;
    
    setIsJoining(true);
    setError('');
    
    const result = joinRoom(roomCode.toUpperCase(), userName.trim());
    
    if (result.success) {
      navigate(`/room/${roomCode}`);
    } else {
      setError(result.error || 'Failed to join room. Please check the code and try again.');
      setIsJoining(false);
    }
  };

  return (
    <div className="join-room-container">
      <div className="snowflakes" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>

      <div className="join-room-card">
        <div className="tree-icon">🎄</div>
        <h1>Join a Secret Santa Room</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleJoinRoom} className="join-form">
          <div className="form-group">
            <label htmlFor="roomCode">Room Code:</label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              required
              className="code-input"
              maxLength="7"
              autoComplete="off"
              autoCapitalize="characters"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="userName">Your Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
              className="name-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="join-button"
            disabled={!roomCode || !userName.trim() || isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        </form>

        <div className="help-section">
          <h3>Don't have a code?</h3>
          <p>Ask your friend to share their room code with you or <a href="/create">create your own room</a>.</p>
        </div>
      </div>
    </div>
  );
}
