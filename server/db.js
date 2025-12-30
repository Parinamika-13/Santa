import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('santa.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    room_id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'waiting', -- 'waiting', 'started'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    name TEXT NOT NULL,
    socket_id TEXT,
    assigned_to TEXT, -- Name of the person they are gifting to
    FOREIGN KEY(room_id) REFERENCES rooms(room_id)
  );

  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT,
    from_name TEXT,
    to_name TEXT,
    image_url TEXT,
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    giver TEXT,
    receiver TEXT,
    room_group_id TEXT -- to track "same group" across years/sessions, maybe just use room_id for now or a group name
  );
`);

export default db;
