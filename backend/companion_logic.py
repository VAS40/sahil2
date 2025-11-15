import os
import random
from typing import Dict, List, Optional

from data import COMPANIONS

try:  # pragma: no cover - optional dependency
    import google.generativeai as genai
except ImportError:  # pragma: no cover - gracefully handle missing SDK
    genai = None

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
_gemini_model = None

CONTEXT_HINTS = {
    "general": "Player lounge catch-up.",
    "squad": "Squad strategy room.",
    "matchmaking": "Lobby + skill matchmaking desk.",
    "rewards": "Rewards & progression lab.",
}

if GEMINI_API_KEY and genai:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel(GEMINI_MODEL)
    except Exception:
        _gemini_model = None


def _context_line(context: str) -> str:
    hint = CONTEXT_HINTS.get(context, CONTEXT_HINTS["general"])
    return f"**Mode:** {hint}"


def _template_response(companion, mood, game, performance, context):
    companion_data = COMPANIONS[companion]
    base = random.choice(companion_data["examples"])

    mood_map = {
        "Chill": "Keeping it easy today — I’ll pick something relaxing.",
        "Pumped": "Love the energy! Let's go for something challenging.",
        "Social": "Perfect moment to team up — want me to send invites?",
        "Curious": "I can show you a new game type you might love!",
    }

    perf_map = {
        "WinStreak": "🔥 You're on a roll! Let's extend that streak.",
        "LoseStreak": "Tough matches happen — want me to find an easier lobby?",
        "Balanced": "Steady runs — want to try a new challenge?",
    }

    game_map = {
        "Arcade": "Arcade mode looks great for your mood!",
        "Rummy": "Rummy table is active — good chance for quick matches!",
        "Ludo": "Ludo rooms are chill right now — good for relaxed play.",
        "Shooter": "Shooter lobbies are competitive tonight — ready?",
    }

    final = f"""
🎮 **{companion} here!**  
{base}

{_context_line(context)}  
**Mood-based nudge:** {mood_map[mood]}  
**Performance note:** {perf_map[performance]}  
**Game insight:** {game_map[game]}  
"""

    return final


def _build_gemini_prompt(companion, mood, game, performance, context):
    c = COMPANIONS[companion]
    context_hint = CONTEXT_HINTS.get(context, CONTEXT_HINTS["general"])
    prompt = f"""
You are {companion}, the {c['persona']} companion inside WinZo's PlayPal AI. Stay {c['tone']} with {c['style']} cadence.
Craft a concise coaching message (max 120 words) that feels like live chat. Reference:
- Mood: {mood}
- Game: {game}
- Performance pattern: {performance}
 - Experience zone: {context_hint}
Blend encouragement, a smart nudge, and a game/ reward insight exactly like WinZo Boss deck examples.
Format as Markdown:
🎮 **{companion} checking in!**
- Mode: ...
- Energy Boost: ...
- Smart Nudge: ...
- Game/Reward Insight: ...
Keep emojis tasteful (max 2).
"""
    return prompt


def _gemini_response(companion, mood, game, performance, context) -> Optional[str]:
    if not _gemini_model:
        return None
    prompt = _build_gemini_prompt(companion, mood, game, performance, context)
    try:
        result = _gemini_model.generate_content(prompt)
    except Exception:
        return None

    text = getattr(result, "text", None)
    if text:
        return text.strip()

    candidates = getattr(result, "candidates", None)
    if not candidates:
        return None

    candidate = candidates[0]
    content = getattr(candidate, "content", None)
    parts = None
    if content is not None:
        parts = getattr(content, "parts", None)
    elif isinstance(candidate, dict):
        parts = candidate.get("content", {}).get("parts")

    if not parts:
        return None

    assembled = []
    for part in parts:
        text_value = getattr(part, "text", None)
        if text_value:
            assembled.append(text_value)
        elif isinstance(part, dict):
            maybe = part.get("text")
            if maybe:
                assembled.append(maybe)
    content = "\n".join(assembled).strip()
    return content or None


def _build_suggestions(companion, mood, game, performance, context) -> List[Dict]:
    suggestions: List[Dict] = []

    if performance == "LoseStreak":
        suggestions.append(
            {
                "title": "Shift to a relaxed lobby",
                "detail": "I'll slot you into a low-ranked room to rebuild confidence.",
                "updates": {"performance": "Balanced"},
            }
        )
        suggestions.append(
            {
                "title": "Skill micro-drill",
                "detail": "Run a 3-min refresher with Soniya's drills before next match.",
                "updates": {"companion": "Soniya"},
            }
        )

    if performance == "WinStreak":
        suggestions.append(
            {
                "title": "Push a ranked sprint",
                "detail": "Lock in an advanced lobby to cash in on the hot streak.",
                "updates": {"performance": "WinStreak", "game": game},
            }
        )

    if mood == "Social":
        suggestions.append(
            {
                "title": "Ping the squad",
                "detail": "Zeel can invite your top 3 teammates instantly.",
                "updates": {"companion": "Zeel"},
            }
        )

    if mood == "Chill":
        suggestions.append(
            {
                "title": "Queue something cozy",
                "detail": "Ayaan will line up a low-pressure Ludo/Arcade mix.",
                "updates": {"companion": "Ayaan", "game": "Ludo"},
            }
        )

    if game == "Shooter":
        suggestions.append(
            {
                "title": "Warm-up aim mode",
                "detail": "Run a quick target course before rejoining the lobby.",
                "updates": {"game": "Shooter", "performance": "Balanced"},
            }
        )

    if companion == "Rivo":
        suggestions.append(
            {
                "title": "Claim cashback",
                "detail": "Rivo spotted a coins drop in your wallet — grab it.",
                "updates": {"companion": "Rivo"},
            }
        )

    if context == "matchmaking":
        suggestions.append(
            {
                "title": "Auto-match by vibe",
                "detail": "I'll scout lobbies that match your streak + mode preference.",
                "updates": {},
            }
        )

    if context == "squad":
        suggestions.append(
            {
                "title": "Share streak with squad",
                "detail": "Broadcast your streak stats to help teammates adapt roles.",
                "updates": {"mood": "Social"},
            }
        )

    if context == "rewards":
        suggestions.append(
            {
                "title": "Trigger daily bonus",
                "detail": "Quick mission -> coins boost before your next queue.",
                "updates": {"companion": "Rivo"},
            }
        )

    if not suggestions:
        suggestions.append(
            {
                "title": "Let PlayPal decide",
                "detail": "I'll auto-tune the lobby & companion for your session.",
                "updates": {},
            }
        )

    return suggestions[:3]


def generate_response(companion, mood, game, performance, context="general"):
    llm_reply = _gemini_response(companion, mood, game, performance, context)
    message = llm_reply or _template_response(companion, mood, game, performance, context)
    suggestions = _build_suggestions(companion, mood, game, performance, context)
    return {"response": message, "suggestions": suggestions, "context": context}
