import ChatBox from "../components/ChatBox.jsx";

const loungeHighlights = [
  "Mood-aware guidance + streak recalls",
  "Drop-off detection + reactivation cues",
  "Coach vs. chill persona toggling"
];

export default function CompanionHub() {
  return (
    <div className="page-grid">
      <section className="page-card">
        <h2>Player Lounge</h2>
        <p>
          High level conversation hub where PlayPal senses your energy, checks in on
          past runs, and lines up the right buddy tone.
        </p>
        <ul className="pulse-list">
          {loungeHighlights.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <ChatBox
        context="general"
        headline="Personal Companion"
        description="Mix personas to get coaching, comfort or rewards guidance."
        chips={["General", "Mood", "Performance"]}
      />
    </div>
  );
}
