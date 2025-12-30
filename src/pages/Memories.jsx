import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/themes.css";

export default function Memories() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  async function fetchMemories() {
    try {
      const res = await fetch("/api/memories");
      const data = await res.json();
      setMemories(data);
    } catch (err) {
      console.error("Failed to load memories", err);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fromName || !toName || !preview) return alert("Fill all fields and pick an image!");

    setLoading(true);
    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_name: fromName,
          to_name: toName,
          description: desc,
          image_url: preview // Sending Base64
        })
      });

      setShowForm(false);
      setFromName("");
      setToName("");
      setDesc("");
      setPreview("");
      setImageFile(null);
      fetchMemories(); // Refresh list
    } catch (err) {
      alert("Error saving memory");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container" style={{ paddingTop: "60px" }}>
      <nav className="dash-nav">
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Memories 📸</h1>
        <button onClick={() => navigate("/")}>Back</button>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {!showForm ? (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button onClick={() => setShowForm(true)} style={{ fontSize: "1.2rem", padding: "1rem 2rem" }}>
              + Add New Memory
            </button>
          </div>
        ) : (
          <div className="card-form" style={{ maxWidth: "500px", margin: "0 auto 2rem auto" }}>
            <h3>Add a Memory</h3>
            <input placeholder="From (Your Name)" value={fromName} onChange={e => setFromName(e.target.value)} />
            <input placeholder="To (Recipient)" value={toName} onChange={e => setToName(e.target.value)} />
            <textarea placeholder="Description / Message" value={desc} onChange={e => setDesc(e.target.value)} />

            <div style={{ margin: "10px 0" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Upload Photo:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {preview && <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }} />}

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Uploading..." : "Save Memory"}
            </button>
            <button className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        )}

        {/* GALLERY GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {memories.map((mem) => (
            <div key={mem.id} className="dash-card" style={{ height: "auto", cursor: "default", padding: "0", overflow: "hidden" }}>
              <img src={mem.image_url} alt="Memory" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "1rem" }}>
                <h4 style={{ margin: "0 0 5px 0" }}>{mem.from_name} ➔ {mem.to_name}</h4>
                <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>{mem.description}</p>
                <small style={{ opacity: 0.5 }}>{new Date(mem.timestamp).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>

        {memories.length === 0 && !showForm && (
          <p style={{ textAlign: "center", opacity: 0.6 }}>No memories yet. Add your first one!</p>
        )}
      </div>
    </div>
  );
}
