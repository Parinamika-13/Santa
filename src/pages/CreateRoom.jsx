import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/themes.css";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return alert("Please enter your name!");

    setLoading(true);
    try {
      const res = await fetch("/api/room", { method: "POST" });
      const data = await res.json();

      if (data.roomId) {
        localStorage.setItem("santa_name", name);
        localStorage.setItem("is_creator", "true");
        navigate(`/room/${data.roomId}`);
      }
    } catch (err) {
      alert("Failed to create room: " + err.message);
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
          border: "2px solid rgba(255, 215, 0, 0.3)",
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.1)"
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ fontSize: "4rem", marginBottom: "1rem" }}
        >
          🎄
        </motion.div>

        <h2 style={{
          background: "linear-gradient(to right, #FFD700, #FFA500)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Create a Room
        </h2>
        <p>Become the Host of this year's Magic!</p>

        <div style={{ textAlign: "left", marginBottom: "1rem" }}>
          <label style={{ marginLeft: "10px", fontSize: "0.9rem", color: "#ddd" }}>Your Santa Name</label>
          <input
            type="text"
            placeholder="e.g. Elf Buddy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "1.2rem",
              padding: "1rem"
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #D42426" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          disabled={loading}
          style={{ background: "linear-gradient(45deg, #D42426, #FF4B1F)" }}
        >
          {loading ? "Creating Magic..." : "✨ Create & Enter"}
        </motion.button>

        <button
          className="secondary"
          onClick={() => navigate("/")}
          style={{ marginTop: "10px" }}
        >
          Nevermind
        </button>
      </motion.div>
    </div>
  );
}
