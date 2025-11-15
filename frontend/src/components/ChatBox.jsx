import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const selectOptions = {
  companion: ["Veer", "Zeel", "Ayaan", "Soniya", "Rivo"],
  mood: ["Chill", "Pumped", "Social", "Curious"],
  game: ["Arcade", "Rummy", "Ludo", "Shooter"],
  performance: ["Balanced", "WinStreak", "LoseStreak"],
};

export default function ChatBox({
  context = "general",
  headline = "Conversation Setup",
  description,
  defaultForm,
  chips = [],
  placeholder = "Ask your companion to see tailored nudges.",
}) {
  const initialRef = useRef(
    defaultForm || {
      companion: "Veer",
      mood: "Chill",
      game: "Arcade",
      performance: "Balanced",
    }
  );

  const [form, setForm] = useState(initialRef.current);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const personaCopy = useMemo(() => {
    const descriptions = {
      Veer: "Competitive climber who pushes you to chase top ranks.",
      Zeel: "Hype friend who coordinates squads + social runs.",
      Ayaan: "Chill buddy for relaxed, low-pressure play.",
      Soniya: "Skill mentor with tips, drills, and stats.",
      Rivo: "Rewards guru spotting bonuses & deals.",
    };
    return descriptions[form.companion];
  }, [form.companion]);

  const headerCopy = description || personaCopy;

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSend(nextFormState) {
    const payload = nextFormState ? nextFormState : form;
    if (nextFormState) {
      setForm(payload);
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, context }),
      });
      if (!res.ok) throw new Error("Backend unavailable");
      const data = await res.json();
      setReply(data.response);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(updates = {}) {
    const nextState = { ...form, ...updates };
    handleSend(nextState);
  }

  return (
    <section className="chatbox">
      <div className="panel form-panel">
        <div className="panel-head">
          <div>
            <h2>{headline}</h2>
            <p className="persona-copy">{headerCopy}</p>
          </div>
          {chips.length > 0 && (
            <div className="chip-row">
              {chips.map((label, idx) => (
                <span key={`${label}-${idx}`} className="chip">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid">
          {Object.entries(selectOptions).map(([field, options]) => (
            <label className="field" key={field}>
              <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              <select
                value={form[field]}
                onChange={evt => updateField(field, evt.target.value)}
              >
                {options.map(option => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <button
          type="button"
          className="send"
          onClick={() => handleSend()}
          disabled={loading}
        >
          {loading ? "Generating..." : "Ask Companion"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="panel response-panel">
        <div className="panel-head">
          <span className="response-label">Live Reply</span>
          <span className={`status-dot ${loading ? "pulse" : "idle"}`}></span>
        </div>
        <div className={`response-bubble ${loading ? "thinking" : ""}`}>
          {reply ? (
            <ReactMarkdown>{reply}</ReactMarkdown>
          ) : (
            <p className="placeholder">{placeholder}</p>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions">
            <p className="suggestions-label">Smart nudges</p>
            <div className="suggestion-grid">
              {suggestions.map((suggestion, idx) => (
                <article className="suggestion-card" key={`${suggestion.title}-${idx}`}>
                  <h3>{suggestion.title}</h3>
                  <p>{suggestion.detail}</p>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.updates)}
                  >
                    Apply &amp; Ask
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
