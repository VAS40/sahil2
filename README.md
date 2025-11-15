# WinZo AI Companion MVP

Fast prototype mirroring the WinZo Boss deck experience with a FastAPI backend (rule templates + Google Gemini upgrade) and a Vite + React front-end. The UI now uses multiple surfaces (Player Lounge, Squad Room, Matchmaking, Rewards Lab) and each embeds the companion chat so you can feel how context-switching changes tone, nudges, and lobby suggestions.

## Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # optional virtualenv
pip install -r requirements.txt
export GEMINI_API_KEY=your-key-here          # optional but unlocks Gemini
export GEMINI_MODEL=gemini-1.5-flash         # optional override
uvicorn app:app --reload --port 8000
```

If no Gemini key is configured the server automatically falls back to the deterministic rule-based responses.

## Frontend (Vite)

```bash
cd frontend
npm install
npm run dev  # starts Vite at http://localhost:3000
```

Vite does not auto-open a browser (avoids `cmd.exe` spawn errors on some systems), so manually visit http://localhost:3000 once it starts. Optionally create a `.env` file with `VITE_API_BASE_URL=http://localhost:8000` if you need to point at a different backend.

In the browser, use the top navigation to jump between:
- **Lounge** – general discussion + mood-based insights.
- **Squad Room** – group chat vibes, invites, morale boosts.
- **Matchmaking** – lobby scouting, low-ranked recovery, ranked pushes.
- **Rewards Lab** – cashback, missions, reactivation nudges.

Each view passes a `context` flag to `/chat`, letting the backend/Gemini prompt adapt replies and smart suggestions for that workflow.
