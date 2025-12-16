import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCopy, FaUserFriends, FaGift, FaSnowflake, FaArrowRight } from 'react-icons/fa';
import { useApp } from '../contexts/AppContext';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { createRoom, joinRoom } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !userName.trim()) return;
    
    setIsCreating(true);
    try {
      const code = await createRoom(roomName);
      await joinRoom(code, userName);
      setRoomCode(code);
    } catch (error) {
      console.error('Error creating room:', error);
      // Handle error (show error message)
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (roomCode) {
    return (
      <div className="page">
        <div className="container max-w-2xl">
          <div className="glass-card p-8 text-center">
            <div className="w-24 h-24 bg-christmas-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGift className="text-4xl text-christmas-red" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Room Created! 🎉</h1>
            <p className="text-lg text-snow/80 mb-8">Share this code with your friends to join your Secret Santa exchange</p>
            
            <div className="relative max-w-md mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSnowflake className="text-christmas-gold" />
              </div>
              <input
                type="text"
                value={roomCode}
                readOnly
                className="w-full pl-10 pr-12 py-3 bg-snow/5 border border-snow/10 rounded-lg text-center text-2xl font-mono tracking-widest text-snow"
              />
              <button
                onClick={copyToClipboard}
                className="absolute inset-y-0 right-0 px-4 flex items-center bg-christmas-green/20 hover:bg-christmas-green/30 transition-colors rounded-r-lg"
              >
                <FaCopy className="mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/room/${roomCode}`)}
                className="px-6 py-3 bg-christmas-red hover:bg-christmas-red/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaUserFriends /> Go to Lobby
              </button>
              <button
                onClick={() => {
                  setRoomCode('');
                  setRoomName('');
                  setUserName('');
                }}
                className="px-6 py-3 bg-snow/10 hover:bg-snow/20 text-snow rounded-lg font-medium transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
          
          <div className="mt-8 glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">How to invite friends</h3>
            <ol className="space-y-4">
              {[
                'Share the room code with your friends',
                'Have them enter the code on the Join Room page',
                'Once everyone has joined, start the gift exchange!'
              ].map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-christmas-red/20 text-christmas-red rounded-full flex items-center justify-center mr-3 mt-1">
                    {index + 1}
                  </span>
                  <span className="text-snow/90">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-christmas-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGift className="text-3xl text-christmas-red" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create a Room</h1>
            <p className="text-snow/80">Start a new Secret Santa exchange with friends</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-snow/80 mb-1">
                Room Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 bg-snow/5 border border-snow/10 rounded-lg text-snow placeholder-snow/50 focus:outline-none focus:ring-2 focus:ring-christmas-red/50 focus:border-christmas-red/50 transition-all"
                  placeholder="e.g., Family Christmas 2023"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-snow/80 mb-1">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-snow/5 border border-snow/10 rounded-lg text-snow placeholder-snow/50 focus:outline-none focus:ring-2 focus:ring-christmas-green/50 focus:border-christmas-green/50 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isCreating}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isCreating
                  ? 'bg-christmas-red/70 cursor-not-allowed'
                  : 'bg-gradient-to-r from-christmas-red to-christmas-green hover:from-christmas-red/90 hover:to-christmas-green/90 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl shadow-christmas-red/20'
              } text-white`}
            >
              {isCreating ? 'Creating Room...' : 'Create Room'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-snow/10">
            <p className="text-center text-snow/70 text-sm">
              Already have a room code?{' '}
              <button
                onClick={() => navigate('/join')}
                className="text-christmas-gold hover:text-christmas-gold/80 font-medium"
              >
                Join a room
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
