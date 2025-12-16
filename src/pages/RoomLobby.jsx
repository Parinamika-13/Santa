import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { FaCopy, FaUser, FaCrown, FaGift, FaChevronRight, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomLobby() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { 
    currentRoom, 
    currentUser, 
    startSecretSanta, 
    saveMemory,
    rooms 
  } = useApp();
  
  const [isStarting, setIsStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const room = currentRoom || rooms.find(r => r.code === roomCode);
  
  const isHost = room?.participants[0] === currentUser;
  const canStart = room?.participants.length >= 2;
  
  // Auto-refresh room data every 5 seconds
  useEffect(() => {
    if (!room) return;
    
    const interval = setInterval(() => {
      // In a real app, we would fetch updated room data from the server here
    }, 5000);
    
    return () => clearInterval(interval);
  }, [room]);
  
  const handleCopyLink = () => {
    const joinLink = `${window.location.origin}/join/${roomCode}`;
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleStartGame = async () => {
    if (!canStart || !isHost) return;
    
    setIsStarting(true);
    
    // Start countdown
    setCountdown(5);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Wait for countdown
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start the game
    const result = startSecretSanta(roomCode);
    
    if (result.success) {
      // Save the room to memories before navigating
      saveMemory(result.room);
      navigate(`/results/${roomCode}`);
    } else {
      alert('Failed to start the game. ' + (result.error || 'Please try again.'));
      setIsStarting(false);
    }
  };
  
  if (!room) {
    return (
      <div className="page flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-christmas-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaGift className="text-4xl text-christmas-red" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
          <p className="text-snow/80 mb-6">The room you're looking for doesn't exist or has expired.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 bg-christmas-red hover:bg-christmas-red/90 text-white rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page">
      <div className="container max-w-4xl mx-auto">
        {/* Room Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Room: <span className="text-christmas-green">{roomCode}</span></h1>
              <p className="text-snow/70">
                {isHost ? 'You are the host' : 'Waiting for the host to start...'}
              </p>
            </div>
            <div 
              onClick={handleCopyLink}
              className="bg-snow/5 border border-snow/10 rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:bg-snow/10 transition-colors"
            >
              <FaCopy className="text-christmas-gold" />
              <span className="text-sm font-mono">
                {copied ? 'Copied to clipboard!' : 'Copy Invite Link'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participants Section */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaUsers className="text-christmas-green" />
                  Participants <span className="text-christmas-gold">({room.participants.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-snow/70">
                  <div className="w-2 h-2 rounded-full bg-christmas-green"></div>
                  {room.participants.length} {room.participants.length === 1 ? 'person' : 'people'} joined
                </div>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {room.participants.map((participant, index) => (
                    <motion.div
                      key={participant}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`flex items-center p-3 rounded-lg ${
                        participant === currentUser 
                          ? 'bg-christmas-red/10 border border-christmas-red/20' 
                          : 'bg-snow/5 hover:bg-snow/10'
                      } transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-christmas-gold' : 'bg-christmas-green'
                      }`}>
                        {participant.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{participant}</span>
                          {index === 0 && (
                            <span className="text-xs bg-christmas-gold/20 text-christmas-gold px-2 py-0.5 rounded-full flex items-center">
                              <FaCrown className="mr-1" /> Host
                            </span>
                          )}
                          {participant === currentUser && (
                            <span className="text-xs bg-snow/10 text-snow/80 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-snow/60">
                          {index === 0 ? 'Room creator' : 'Participant'}
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="text-christmas-gold">
                          <FaCrown />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Start Button for Host */}
              {isHost && (
                <div className="mt-8 pt-6 border-t border-snow/10">
                  {countdown !== null ? (
                    <div className="text-center">
                      <div className="text-5xl font-bold text-christmas-red mb-2">{countdown}</div>
                      <p className="text-snow/80">Starting Secret Santa in...</p>
                      <div className="mt-4 h-1 bg-snow/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-christmas-red to-christmas-gold"
                          initial={{ width: '100%' }}
                          animate={{ width: '0%' }}
                          transition={{ duration: 5, ease: 'linear' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartGame}
                      disabled={!canStart || isStarting}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        !canStart || isStarting
                          ? 'bg-snow/10 text-snow/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-christmas-red to-christmas-gold hover:from-christmas-red/90 hover:to-christmas-gold/90 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl shadow-christmas-red/20 text-white'
                      }`}
                    >
                      {isStarting ? (
                        'Preparing...'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <FaGift className="text-lg" />
                          {canStart ? 'Start Secret Santa' : 'Need at least 2 players'}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="glass-card h-full flex flex-col">
              <div className="p-4 border-b border-snow/10">
                <h3 className="font-bold flex items-center gap-2">
                  <FaPaperPlane className="text-christmas-green" />
                  Group Chat
                </h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto max-h-96">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-christmas-green/20 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-christmas-green text-xs" />
                    </div>
                    <div className="bg-snow/5 rounded-lg p-3 text-sm">
                      <div className="font-medium text-christmas-green">System</div>
                      <p className="text-snow/90">Welcome to the Secret Santa room! Chat with other participants while you wait.</p>
                      <div className="text-xs text-snow/50 mt-1">Just now</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-snow/10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-snow/5 border border-snow/10 rounded-full py-2 pl-4 pr-10 text-snow placeholder-snow/50 focus:outline-none focus:ring-2 focus:ring-christmas-green/50 focus:border-christmas-green/50 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-christmas-green hover:bg-christmas-green/90 text-white flex items-center justify-center">
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Waiting Message for Non-Hosts */}
        {!isHost && !isStarting && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-snow/5 border border-snow/10 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-christmas-green animate-pulse"></div>
              <span className="text-sm text-snow/80">Waiting for host to start the game...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
