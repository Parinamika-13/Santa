import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/themes.css";

const SUGGESTIONS = [
    { category: "Funny", text: "Custom Face Socks", price: "$15" },
    { category: "Funny", text: "Toilet Golf Game", price: "$12" },
    { category: "Funny", text: "Bacon Scented candle", price: "$18" },
    { category: "Funny", text: "Emergency Clown Nose", price: "$5" },

    { category: "Sentimental", text: "Framed Photo Collage", price: "$20" },
    { category: "Sentimental", text: "Personalized Mug", price: "$15" },
    { category: "Sentimental", text: "Handwritten Letter", price: "$0" },

    { category: "Useful", text: "Portable Charger", price: "$25" },
    { category: "Useful", text: "Nice Water Bottle", price: "$30" },
    { category: "Useful", text: "Desk Organizer", price: "$15" },

    { category: "Experience", text: "Movie Tickets", price: "$30" },
    { category: "Experience", text: "Cooking Class", price: "$50" },
    { category: "Experience", text: "Concert Tickets", price: "$Var" },
];

export default function Suggestions() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");

    const filteredItems = filter === "All"
        ? SUGGESTIONS
        : SUGGESTIONS.filter(s => s.category === filter);

    return (
        <div className="page-container">
            <div className="card-form" style={{ maxWidth: "800px" }}>
                <h2 style={{ fontFamily: "Mountains of Christmas, cursive", fontSize: "3rem", color: "#d4af37" }}>
                    Gift Suggestions 🎁
                </h2>

                {/* Dropdown for Filter */}
                <div style={{ marginBottom: "2rem", textAlign: "right" }}>
                    <label style={{ marginRight: "10px", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>
                        Filter by Category:
                    </label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "5px",
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                            border: "1px solid #d4af37",
                            fontFamily: "Georgia, serif",
                            fontSize: "1rem",
                            cursor: "pointer"
                        }}
                    >
                        <option value="All" style={{ color: "black" }}>All Categories</option>
                        <option value="Funny" style={{ color: "black" }}>Funny</option>
                        <option value="Sentimental" style={{ color: "black" }}>Sentimental</option>
                        <option value="Useful" style={{ color: "black" }}>Useful</option>
                        <option value="Experience" style={{ color: "black" }}>Experience</option>
                    </select>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1.5rem",
                    maxHeight: "500px",
                    overflowY: "auto",
                    paddingRight: "10px"
                }}>
                    {filteredItems.map((item, i) => (
                        <div key={i} style={{
                            background: "rgba(0,0,0,0.3)",
                            padding: "1.5rem",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            textAlign: "left"
                        }}>
                            <span style={{
                                background: "#d4af37",
                                color: "#3e1e1e",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                textTransform: "uppercase"
                            }}>
                                {item.category}
                            </span>
                            <h3 style={{ margin: "10px 0", fontSize: "1.4rem" }}>{item.text}</h3>
                            <p style={{ color: "#aaa", fontStyle: "italic" }}>Est. {item.price}</p>
                        </div>
                    ))}
                </div>

                <button
                    className="secondary"
                    onClick={() => navigate("/")}
                    style={{ marginTop: "2rem" }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
