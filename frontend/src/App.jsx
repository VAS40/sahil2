import { NavLink, Route, Routes } from "react-router-dom";
import CompanionHub from "./pages/CompanionHub.jsx";
import MatchmakingLab from "./pages/MatchmakingLab.jsx";
import RewardsLab from "./pages/RewardsLab.jsx";
import SquadRoom from "./pages/SquadRoom.jsx";
import "./App.css";

const navItems = [
  { label: "Lounge", path: "/" },
  { label: "Squad Room", path: "/squad" },
  { label: "Matchmaking", path: "/match" },
  { label: "Rewards Lab", path: "/rewards" }
];

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <p className="badge">PlayPal AI</p>
        <h1>WinZo AI Companion</h1>
        <p className="subhead">
          Multi-surface demo showing how Veer, Zeel, Ayaan, Soniya, and Rivo adapt per
          context: general discussion, squad chat, matchmaking, and reward nudges.
        </p>
      </header>

      <nav className="primary-nav">
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? "active" : "") }>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="view-shell">
        <Routes>
          <Route path="/" element={<CompanionHub />} />
          <Route path="/squad" element={<SquadRoom />} />
          <Route path="/match" element={<MatchmakingLab />} />
          <Route path="/rewards" element={<RewardsLab />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
