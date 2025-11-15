from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from companion_logic import generate_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
def chat(payload: dict):
    companion = payload["companion"]
    mood = payload["mood"]
    game = payload["game"]
    performance = payload["performance"]
    context = payload.get("context", "general")

    reply = generate_response(companion, mood, game, performance, context)
    return reply
