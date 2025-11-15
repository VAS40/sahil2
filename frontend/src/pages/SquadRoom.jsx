import ChatBox from "../components/ChatBox.jsx";

const squadOnline = [
  { name: "Mira", status: "On Rummy streak", role: "Support" },
  { name: "Dex", status: "Shooter warm-ups", role: "Entry" },
  { name: "Niko", status: "Arcade chill", role: "Flex" }
];

export default function SquadRoom() {
  return (
    <div className="page-grid">
      <section className="page-card">
        <h2>Squad Signal</h2>
        <p>
          Showcase how PlayPal would talk inside a group chat: it nudges invites,
          shares streak intel, and keeps morale synced.
        </p>
        <div className="roster">
          {squadOnline.map(player => (
            <article key={player.name} className="roster-card">
              <h3>{player.name}</h3>
              <p>{player.status}</p>
              <span>{player.role}</span>
            </article>
          ))}
        </div>
      </section>

      <ChatBox
        context="squad"
        headline="Squad Chat Companion"
        description="Zeel / Veer style prompts for team energy + calls to action."
        chips={["Squad", "Invites", "Morale"]}
        defaultForm={{ companion: "Zeel", mood: "Social", game: "Shooter", performance: "Balanced" }}
        placeholder="Squad chat replies show up here."
      />
    </div>
  );
}
