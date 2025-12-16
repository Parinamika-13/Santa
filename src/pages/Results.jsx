import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Results() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { 
    currentRoom, 
    currentUser, 
    getAssignedPerson,
    addGift,
    addPhoto,
    saveMemory
  } = useApp();
  
  const [assignedPerson, setAssignedPerson] = useState(null);
  const [giftIdea, setGiftIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [savedGift, setSavedGift] = useState('');
  const [savedPhoto, setSavedPhoto] = useState('');
  
  // Get the assigned person when component mounts
  useEffect(() => {
    if (currentUser && roomCode) {
      const assigned = getAssignedPerson(roomCode, currentUser);
      setAssignedPerson(assigned);
      
      // Check if we already have saved gift/photo
      if (currentRoom?.gifts?.[currentUser]) {
        setSavedGift(currentRoom.gifts[currentUser]);
      }
      
      // In a real app, we would check for saved photos here
    }
  }, [currentUser, roomCode, currentRoom, getAssignedPerson]);
  
  const handleGiftSubmit = (e) => {
    e.preventDefault();
    if (!giftIdea.trim() || !assignedPerson) return;
    
    setIsSubmitting(true);
    
    // In a real app, we would save this to the server
    addGift(roomCode, currentUser, giftIdea);
    
    setSavedGift(giftIdea);
    setGiftIdea('');
    setIsSubmitting(false);
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    setPhoto(file);
  };
  
  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (!photo) return;
    
    setIsSubmitting(true);
    
    // In a real app, we would upload the photo to a server
    // For now, we'll just use the preview URL
    addPhoto(roomCode, previewUrl);
    setSavedPhoto(previewUrl);
    setPhoto(null);
    setPreviewUrl('');
    setIsSubmitting(false);
  };
  
  const handleFinish = () => {
    // Save everything to memories before navigating away
    if (currentRoom) {
      saveMemory(currentRoom);
    }
    navigate('/memories');
  };
  
  if (!assignedPerson) {
    return (
      <div className="loading-screen">
        <div className="spinner">🎅</div>
        <h2>Loading your Secret Santa assignment...</h2>
      </div>
    );
  }
  
  return (
    <div className="results-container">
      <div className="snowflakes" aria-hidden="true">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>
      
      <div className="results-card">
        <div className="confetti">🎉</div>
        <h1>Secret Santa Assignment</h1>
        
        <div className="assignment-box">
          <div className="assignment-text">
            <p>Ho ho ho, <span className="highlight">{currentUser}</span>!</p>
            <p>You are giving a gift to:</p>
            <div className="assigned-person">{assignedPerson}</div>
            <div className="santa-hat">🎅</div>
          </div>
        </div>
        
        <div className="gift-section">
          <h2>Gift Ideas</h2>
          {savedGift ? (
            <div className="saved-gift">
              <p>Your saved gift idea for {assignedPerson}:</p>
              <div className="gift-idea">"{savedGift}"</div>
            </div>
          ) : (
            <form onSubmit={handleGiftSubmit} className="gift-form">
              <label htmlFor="giftIdea">Share a gift idea for {assignedPerson}:</label>
              <div className="input-group">
                <input
                  type="text"
                  id="giftIdea"
                  value={giftIdea}
                  onChange={(e) => setGiftIdea(e.target.value)}
                  placeholder="E.g., A cozy blanket, a book, or a gift card..."
                  className="gift-input"
                />
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={!giftIdea.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="photo-section">
          <h2>Share a Photo</h2>
          {savedPhoto ? (
            <div className="saved-photo">
              <p>Your shared photo:</p>
              <img src={savedPhoto} alt="Your shared gift" className="gift-photo" />
            </div>
          ) : (
            <form onSubmit={handlePhotoSubmit} className="photo-form">
              <label htmlFor="giftPhoto">Upload a photo of your gift (optional):</label>
              <div className="photo-upload">
                <input
                  type="file"
                  id="giftPhoto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file-input"
                />
                <label htmlFor="giftPhoto" className="file-label">
                  Choose a photo
                </label>
                {previewUrl && (
                  <div className="photo-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}
                <button 
                  type="submit" 
                  className="upload-button"
                  disabled={!photo || isSubmitting}
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="actions">
          <button onClick={handleFinish} className="finish-button">
            View All Memories
          </button>
          <p className="hint">You can come back later to add more details!</p>
        </div>
      </div>
    </div>
  );
}
