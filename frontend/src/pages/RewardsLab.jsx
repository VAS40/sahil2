import ChatBox from "../components/ChatBox.jsx";

const missions = [
  { label: "Daily streak", reward: "+50 coins", eta: "Play 2 Arcade" },
  { label: "Squad rally", reward: "Loot crate", eta: "Invite 1 friend" },
  { label: "Pro drill", reward: "Skill XP", eta: "Finish Aim Drill" }
];

export default function RewardsLab() {
  return (
    <div className="page-grid">
      <section className="page-card">
        <h2>Rewards & Progression</h2>
        <p>
          Value-focused lane where PlayPal highlights bonuses, cashback drops, and
          coaching loops to keep motivation high.
        </p>
        <div className="mission-list">
          {missions.map(mission => (
            <article key={mission.label} className="mission-card">
              <h3>{mission.label}</h3>
              <p>{mission.eta}</p>
              <span>{mission.reward}</span>
            </article>
          ))}
        </div>
      </section>

      <ChatBox
        context="rewards"
        headline="Rewards Concierge"
        description="Rivo surfaces bonuses while other personas weave in coaching tasks."
        chips={["Rewards", "Reactivation", "Progress"]}
        defaultForm={{ companion: "Rivo", mood: "Pumped", game: "Rummy", performance: "Balanced" }}
        placeholder="Ask for cashback, missions, or streak rewards."
      />
    </div>
  );
}
