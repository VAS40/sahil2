import ChatBox from "../components/ChatBox.jsx";

const lobbyData = [
  { name: "Arcade Pulse", entry: "Low risk", eta: "1 min" },
  { name: "Rummy Elite", entry: "Mid stakes", eta: "Now" },
  { name: "Shooter Valor", entry: "Rank push", eta: "3 mins" }
];

export default function MatchmakingLab() {
  return (
    <div className="page-grid">
      <section className="page-card">
        <h2>Matchmaking Radar</h2>
        <p>
          Real-time lobby insights. Pair with the chatbot to let Gemini pitch the next
          best match, low-ranked recovery, or streak extension plan.
        </p>
        <div className="lobby-grid">
          {lobbyData.map(lobby => (
            <article key={lobby.name} className="lobby-card">
              <h3>{lobby.name}</h3>
              <p>{lobby.entry}</p>
              <span>ETA {lobby.eta}</span>
            </article>
          ))}
        </div>
      </section>

      <ChatBox
        context="matchmaking"
        headline="Matchmaking Coach"
        description="Use moods + streaks to scout better lobbies or downtier safety nets."
        chips={["Match", "Recovery", "Recommendations"]}
        defaultForm={{ companion: "Soniya", mood: "Curious", game: "Shooter", performance: "LoseStreak" }}
        placeholder="Ask for lobby scouting help here."
      />
    </div>
  );
}
