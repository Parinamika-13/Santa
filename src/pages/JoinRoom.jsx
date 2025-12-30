import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/themes.css";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setRoomId(code.toUpperCase());
    }
  }, [searchParams]);

  async function handleJoin() {
    if (!roomId.trim() || !name.trim()) return alert("Enter both Room ID and Your Name!");

    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, name })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Room not found");
      }

      const data = await res.json();
      localStorage.setItem("santa_name", name);
      localStorage.setItem("is_creator", "false");
      navigate(`/room/${roomId.toUpperCase()}`);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="card-form"
        style={{
          background: "rgba(20, 40, 60, 0.6)",
          border: "2px solid rgba(0, 255, 255, 0.3)",
          boxShadow: "0 0 40px rgba(0, 255, 255, 0.1)"
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{ fontSize: "4rem", marginBottom: "1rem" }}
        >
          ❄️
        </motion.div>

        <h2 style={{
          background: "linear-gradient(to right, #00FFFF, #00BFFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Join the Fun
        </h2>

        <input
          type="text"
          placeholder="Room Code (e.g. XMAS24)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          style={{ textAlign: "center", textTransform: "uppercase", letterSpacing: "3px", fontWeight: "bold" }}
        />
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          style={{ textAlign: "center" }}
        />

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00BFFF" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          disabled={loading}
          style={{ background: "linear-gradient(45deg, #00b09b, #96c93d)" }}
        >
          {loading ? "Joining..." : "Enter Room"}
        </motion.button>

        <button className="secondary" onClick={() => navigate("/")}>
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
