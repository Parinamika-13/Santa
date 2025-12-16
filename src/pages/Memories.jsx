import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Memories() {
  const { memories } = useApp();
  const [activeMemory, setActiveMemory] = useState(null);
  const navigate = useNavigate();
  
  // Sort memories by date (newest first)
  const sortedMemories = [...(memories || [])].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Set the first memory as active by default
  useEffect(() => {
    if (sortedMemories.length > 0 && !activeMemory) {
      setActiveMemory(sortedMemories[0]);
    }
  }, [memories, sortedMemories, activeMemory]);
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleCreateNew = () => {
    navigate('/create');
  };
  
  if (sortedMemories.length === 0) {
    return (
      <div className="memories-container empty-state">
        <div className="snowflakes" aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="snowflake">❅</div>
          ))}
        </div>
        
        <div className="empty-memories">
          <div className="gift-icon">🎁</div>
          <h1>No Memories Yet</h1>
          <p>Your Secret Santa memories will appear here after you complete a game.</p>
          <button onClick={handleCreateNew} className="create-button">
            Create a New Secret Santa
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="memories-container">
      <div className="snowflakes" aria-hidden="true">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>
      
      <div className="memories-header">
        <h1>🎄 Secret Santa Memories</h1>
        <p>Relive the joy of past gift exchanges</p>
      </div>
      
      <div className="memories-layout">
        <div className="memories-sidebar">
          <h2>Past Events</h2>
          <div className="memory-list">
            {sortedMemories.map((memory) => (
              <div 
                key={memory.id}
                className={`memory-item ${activeMemory?.id === memory.id ? 'active' : ''}`}
                onClick={() => setActiveMemory(memory)}
              >
                <div className="memory-date">
                  {formatDate(memory.date).split(',')[0]}
                </div>
                <div className="memory-code">{memory.code}</div>
                <div className="memory-participants">
                  {memory.participants.length} participants
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={handleCreateNew} className="new-memory-button">
            + New Secret Santa
          </button>
        </div>
        
        {activeMemory && (
          <div className="memory-details">
            <div className="memory-header">
              <h2>Secret Santa #{activeMemory.code}</h2>
              <div className="memory-meta">
                <span className="date">{formatDate(activeMemory.date)}</span>
                <span className="participant-count">
                  🎅 {activeMemory.participants.length} Participants
                </span>
              </div>
            </div>
            
            <div className="assignments-section">
              <h3>Gift Assignments</h3>
              <div className="assignments-grid">
                {Object.entries(activeMemory.assignments || {}).map(([giver, receiver]) => (
                  <div key={giver} className="assignment-card">
                    <div className="giver">{giver}</div>
                    <div className="arrow">🎁</div>
                    <div className="receiver">{receiver}</div>
                    {activeMemory.gifts?.[giver] && (
                      <div className="gift-idea">
                        <span className="label">Gift idea:</span> {activeMemory.gifts[giver]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {(activeMemory.photos?.length > 0) && (
              <div className="photos-section">
                <h3>Shared Photos</h3>
                <div className="photo-gallery">
                  {activeMemory.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Gift ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="share-section">
              <h3>Share These Memories</h3>
              <div className="share-buttons">
                <button className="share-button">
                  <span className="icon">📱</span> Copy Link
                </button>
                <button className="share-button">
                  <span className="icon">✉️</span> Email
                </button>
                <button className="share-button">
                  <span className="icon">📱</span> Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
