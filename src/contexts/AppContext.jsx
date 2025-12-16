import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem('secretSantaRooms');
    return savedRooms ? JSON.parse(savedRooms) : [];
  });
  
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem('secretSantaMemories');
    return savedMemories ? JSON.parse(savedMemories) : [];
  });

  // Save to localStorage when rooms or memories change
  useEffect(() => {
    localStorage.setItem('secretSantaRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('secretSantaMemories', JSON.stringify(memories));
  }, [memories]);

  const createRoom = () => {
    const roomCode = `XMAS${Math.floor(1000 + Math.random() * 9000)}`;
    const newRoom = {
      id: uuidv4(),
      code: roomCode,
      participants: [],
      assignments: {},
      status: 'waiting', // 'waiting', 'started', 'completed'
      createdAt: new Date().toISOString(),
    };
    
    setRooms([...rooms, newRoom]);
    return newRoom;
  };

  const joinRoom = (roomCode, userName) => {
    const room = rooms.find(r => r.code === roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    
    if (room.participants.includes(userName)) {
      return { success: false, error: 'Name already taken in this room' };
    }

    const updatedRoom = {
      ...room,
      participants: [...room.participants, userName]
    };

    setRooms(rooms.map(r => r.id === room.id ? updatedRoom : r));
    setCurrentRoom(updatedRoom);
    setCurrentUser(userName);
    
    return { success: true, room: updatedRoom };
  };

  const startSecretSanta = (roomCode) => {
    const room = rooms.find(r => r.code === roomCode);
    if (!room || room.participants.length < 2) {
      return { success: false, error: 'Not enough participants' };
    }

    // Shuffle participants for assignment
    const shuffled = [...room.participants].sort(() => 0.5 - Math.random());
    const assignments = {};
    
    // Create assignments ensuring no one gets themselves
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];
      assignments[giver] = receiver;
    }

    const updatedRoom = {
      ...room,
      assignments,
      status: 'started',
      startedAt: new Date().toISOString()
    };

    setRooms(rooms.map(r => r.code === roomCode ? updatedRoom : r));
    
    // Play Christmas music
    const audio = new Audio('/we-wish-you-a-merry-christmas.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    return { success: true, room: updatedRoom };
  };

  const saveMemory = (room) => {
    if (!room) return;
    
    const memory = {
      id: room.id,
      code: room.code,
      date: room.startedAt || room.createdAt,
      participants: room.participants,
      assignments: room.assignments,
      gifts: {},
      photos: []
    };
    
    setMemories([...memories, memory]);
    
    // Remove the room after saving to memories
    setRooms(rooms.filter(r => r.id !== room.id));
    setCurrentRoom(null);
  };

  const addGift = (roomCode, giver, gift) => {
    const room = rooms.find(r => r.code === roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    
    const updatedRoom = {
      ...room,
      gifts: {
        ...room.gifts,
        [giver]: gift
      }
    };

    setRooms(rooms.map(r => r.code === roomCode ? updatedRoom : r));
    return { success: true, room: updatedRoom };
  };

  const addPhoto = (roomCode, photoUrl) => {
    const room = rooms.find(r => r.code === roomCode);
    if (!room) return { success: false, error: 'Room not found' };
    
    const updatedRoom = {
      ...room,
      photos: [...(room.photos || []), photoUrl]
    };

    setRooms(rooms.map(r => r.code === roomCode ? updatedRoom : r));
    return { success: true, room: updatedRoom };
  };

  const getAssignedPerson = (roomCode, userName) => {
    const room = rooms.find(r => r.code === roomCode);
    if (!room || !room.assignments) return null;
    return room.assignments[userName] || null;
  };

  return (
    <AppContext.Provider value={{
      rooms,
      currentRoom,
      currentUser,
      memories,
      createRoom,
      joinRoom,
      startSecretSanta,
      saveMemory,
      addGift,
      addPhoto,
      getAssignedPerson,
      setCurrentRoom,
      setCurrentUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
