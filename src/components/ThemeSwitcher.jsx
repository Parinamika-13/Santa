import { useTheme } from "../ThemeContext";
import "../switcher.css";

export default function ThemeSwitcher() {
  const { theme, setTheme, cycleTheme } = useTheme();

  return (
    <div className="switcher-wrapper">

      {/* 1️⃣ Button Switcher */}
      <div className="theme-buttons">
        <button onClick={() => setTheme("luxury")}>🎄 Red Gold</button>
        <button onClick={() => setTheme("frost")}>❄ Frost</button>
        <button onClick={() => setTheme("candy")}>🍬 Candy</button>
      </div>

      {/* 2️⃣ Apple Toggle */}
      <div className="apple-toggle" onClick={cycleTheme}>
        <div className={`toggle-knob ${theme}`}></div>
      </div>

      {/* 3️⃣ Floating Ornaments */}
      <div className="floating-ornaments">
        <div
          className="ornament red"
          onClick={() => setTheme("luxury")}
        >
          🎁
        </div>
        <div
          className="ornament blue"
          onClick={() => setTheme("frost")}
        >
          ❄
        </div>
        <div
          className="ornament candy"
          onClick={() => setTheme("candy")}
        >
          🍬
        </div>
      </div>

    </div>
  );
}
