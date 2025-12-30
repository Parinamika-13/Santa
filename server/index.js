import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import db from './db.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for local dev
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- API ROUTES ---

// Create Room
app.post('/api/room', (req, res) => {
    const roomId = uuidv4().slice(0, 6).toUpperCase(); // Short code
    try {
        const stmt = db.prepare('INSERT INTO rooms (room_id) VALUES (?)');
        stmt.run(roomId);
        res.json({ roomId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join Room (Check if exists)
app.post('/api/join', (req, res) => {
    const { roomId, name } = req.body;
    const room = db.prepare('SELECT * FROM rooms WHERE room_id = ?').get(roomId);

    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }

    // Register participant if not exists (or update socket later)
    // For now, just validation
    res.json({ success: true, roomId, name });
});

// Get Memories
app.get('/api/memories', (req, res) => {
    const memories = db.prepare('SELECT * FROM memories ORDER BY timestamp DESC').all();
    res.json(memories);
});

app.post('/api/memories', (req, res) => {
    const { from_name, to_name, image_url, description } = req.body;
    const stmt = db.prepare('INSERT INTO memories (from_name, to_name, image_url, description) VALUES (?, ?, ?, ?)');
    stmt.run(from_name, to_name, image_url, description);
    res.json({ success: true });
});

// --- SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ roomId, name }) => {
        socket.join(roomId);

        // Check if user exists in DB, else add
        const existing = db.prepare('SELECT * FROM participants WHERE room_id = ? AND name = ?').get(roomId, name);
        if (!existing) {
            db.prepare('INSERT INTO participants (id, room_id, name, socket_id) VALUES (?, ?, ?, ?)').run(uuidv4(), roomId, name, socket.id);
        } else {
            // Update socket id
            db.prepare('UPDATE participants SET socket_id = ? WHERE id = ?').run(socket.id, existing.id);
        }

        // Broadcast updated list
        const participants = db.prepare('SELECT name, assigned_to FROM participants WHERE room_id = ?').all(roomId);
        io.to(roomId).emit('participants_update', participants);
    });

    socket.on('start_game', ({ roomId }) => {
        // 1. Get all participants
        const participants = db.prepare('SELECT * FROM participants WHERE room_id = ?').all(roomId);
        if (participants.length < 2) return; // Need at least 2

        // 2. Shuffle and Assign
        const names = participants.map(p => p.name);
        let assignments = {};
        let valid = false;
        let attempts = 0;

        // Simple constraint: Cannot assign to self.
        // Enhanced constraint: Check history (Not fully implemented for brevity, but framework is here)

        while (!valid && attempts < 100) {
            let shuffled = [...names].sort(() => Math.random() - 0.5);
            let tempAssignments = {};
            let conflict = false;

            for (let i = 0; i < names.length; i++) {
                if (names[i] === shuffled[i]) {
                    conflict = true;
                    break;
                }
                // Check history here if needed
                // const pastMatch = db.prepare(...).get(names[i], shuffled[i]);
                // if (pastMatch) conflict = true;

                tempAssignments[names[i]] = shuffled[i];
            }

            if (!conflict) {
                assignments = tempAssignments;
                valid = true;
            }
            attempts++;
        }

        if (valid) {
            // Save to DB
            const updateStmt = db.prepare('UPDATE participants SET assigned_to = ? WHERE room_id = ? AND name = ?');
            const insertHistory = db.prepare('INSERT INTO history (giver, receiver, room_group_id) VALUES (?, ?, ?)');

            const tx = db.transaction(() => {
                for (const [giver, receiver] of Object.entries(assignments)) {
                    updateStmt.run(receiver, roomId, giver);
                    insertHistory.run(giver, receiver, roomId);
                }
                db.prepare('UPDATE rooms SET status = ? WHERE room_id = ?').run('started', roomId);
            });
            tx();

            // Notify everyone
            io.to(roomId).emit('game_started');

            // Send individual assignments
            // fetch socket IDs for each user
            const updatedParticipants = db.prepare('SELECT * FROM participants WHERE room_id = ?').all(roomId);
            updatedParticipants.forEach(p => {
                if (p.socket_id) {
                    io.to(p.socket_id).emit('your_assignment', { target: p.assigned_to });
                }
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
