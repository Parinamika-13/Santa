import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SantaTransition from "../components/SantaTransition";
import ChristmasTree from "../components/ChristmasTree";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");

  function handleNavigate(route) {
    setTargetRoute(route);
    setShowTransition(true);

    // redirect AFTER animation finishes
    setTimeout(() => {
      navigate(route);
    }, 7000); // 7s for cartoon animation
  }

  return (
    <>
      <div className="dashboard-page">
        {/* VINTAGE LIGHTS (More of them) */}
        <ul className="light-rope">
          {[...Array(30)].map((_, i) => <li key={i}></li>)}
        </ul>

        {/* NAVBAR */}
        <nav className="dash-nav">
          <h1 className="dash-logo">🎅 Secret Santa</h1>

          <div className="nav-profile">
            <span className="profile-name">
              {localStorage.getItem("santa_name") || "Guest Elf"}
            </span>
            <div className="profile-avatar">
              👤
            </div>
          </div>
        </nav>

        {/* HERO TEXT */}
        <div className="dash-hero">
          <h2>Spread the Magic of Giving 🎄</h2>
          <p style={{ opacity: 0.8, fontStyle: 'italic', fontSize: '1.2rem' }}>
            "He who has not Christmas in his heart will never find it under a tree."
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="dash-cards">
          <div className="dash-card create" onClick={() => handleNavigate("/create")}>
            <h3>Create Room</h3>
            <p>Start a brand-new Secret Santa exchange</p>
          </div>

          <div className="dash-card join" onClick={() => handleNavigate("/join")}>
            <h3>Join Room</h3>
            <p>Enter an existing room with a code</p>
          </div>

          <div className="dash-card memories" onClick={() => handleNavigate("/memories")}>
            <h3>Memories</h3>
            <p>Revisit past gifts and happy moments</p>
          </div>

          <div className="dash-card suggestions" onClick={() => handleNavigate("/suggestions")}>
            <h3>Suggestions</h3>
            <p>Find the perfect gift ideas</p>
          </div>
        </div>

        {/* DECORATIVE CHRISTMAS TREE */}
        <ChristmasTree />
      </div>

      {/* FULLSCREEN TRANSITION OVERLAY */}
      <SantaTransition show={showTransition} />
    </>
  );
}
