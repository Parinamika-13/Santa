import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/themes.css";

const socket = io();

export default function RoomLobby() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [myName, setMyName] = useState("");
  const [match, setMatch] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("santa_name");
    const creator = localStorage.getItem("is_creator") === "true";

    if (!name) {
      navigate("/");
      return;
    }

    setMyName(name);
    setIsCreator(creator);

    socket.emit('join_room', { roomId: id, name });

    socket.on('participants_update', (users) => {
      setParticipants(users);
    });

    socket.on('your_assignment', (data) => {
      setMatch(data.target);
    });

    return () => {
      socket.off('participants_update');
      socket.off('your_assignment');
    };
  }, [id, navigate]);

  function copyLink() {
    const url = `${window.location.origin}/join?code=${id}`;
    navigator.clipboard.writeText(`Join my Secret Santa Room!\nCode: ${id}\nLink: ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function startGame() {
    if (participants.length < 2) {
      alert("Need at least 2 people to play!");
      return;
    }
    socket.emit('start_game', { roomId: id });
  }

  return (
    <div className="page-container">
      <AnimatePresence>
        {!match ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="lobby-card"
            style={{ maxWidth: "600px" }}
          >
            <h2 style={{ fontSize: "2.5rem" }}>🎅 Room Code 🎅</h2>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="code-box"
              onClick={copyLink}
              style={{ background: "rgba(255,255,255,0.1)", border: "2px dashed #D42426", cursor: "copy" }}
            >
              {id}
              <span style={{ fontSize: "0.8rem", display: "block", marginTop: "5px", color: "#aaa" }}>
                {copied ? "✅ Copied!" : "(Click to Copy Invite)"}
              </span>
            </motion.div>

            <div className="participants-list" style={{ marginTop: "2rem" }}>
              <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "10px" }}>
                Who's Here? ({participants.length})
              </h3>
              <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {participants.map((p, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "10px",
                      listStyle: "none",
                      textAlign: "center"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>☃️</span>
                    <br />
                    {p.name} {p.name === myName ? "(You)" : ""}
                  </motion.li>
                ))}
              </ul>
            </div>

            {isCreator && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="start-btn"
                onClick={startGame}
                style={{ background: "linear-gradient(to right, #D42426, #C71585)", marginTop: "2rem" }}
              >
                🚀 Start Exchange
              </motion.button>
            )}

            <button className="secondary" onClick={() => navigate("/")} style={{ marginTop: "1rem" }}>
              Leave
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="match-reveal-card"
            style={{
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              boxShadow: "0 0 50px rgba(0,0,0,0.5)",
              border: "4px solid #FFD700"
            }}
          >
            <h2>🎁 Your Match Is...</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="reveal-box"
              style={{ padding: "2rem", background: "white", color: "black", borderRadius: "15px", margin: "2rem 0" }}
            >
              <h1 style={{ fontSize: "3rem", margin: 0, fontFamily: "'Poppins', sans-serif" }}>{match}</h1>
            </motion.div>
            <p>Keep it a secret! 🤫</p>

            <button
              onClick={() => navigate("/")}
              style={{ background: "rgba(255,255,255,0.2)", width: "auto", padding: "10px 30px" }}
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
