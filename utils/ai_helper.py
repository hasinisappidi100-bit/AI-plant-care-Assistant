"""
utils/ai_helper.py
------------------
AI Assistant integration for the "Ask PlantCare AI" chatbot.
Uses google-genai SDK with secure .env key loading.
Provides robust local botanical fallback responses if GEMINI_API_KEY is not configured.
"""

import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# System prompt defining the persona of the PlantCare AI assistant
SYSTEM_PROMPT = """You are 'PlantCare AI', an intelligent, warm, and highly practical botanical assistant.
You are running as the AI core in 'AI PlantCare Assistant'.

Your objectives:
1. Provide clear, concise, actionable advice for plant care, watering, sunlight, soil, fertilizer, pruning, and leaf diseases.
2. Structure answers with bullet points and friendly emojis (💧, ☀️, ✂️, 🌱, 🧪).
3. If the user mentions a specific plant or symptom (e.g. yellow leaves, leaf curl, white spots), give direct diagnosis and remedies.
4. Keep the explanation accessible to beginners and home gardeners (avoid overly dense commercial pesticide jargon).
5. Always maintain a helpful, encouraging tone.
"""

# Pre-defined local knowledge responses for common queries (fallback when API key is missing)
LOCAL_FALLBACK_KNOWLEDGE = {
    "water": (
        "💧 **Watering Best Practice:**\n\n"
        "• **Finger Test:** Insert your index finger 1–2 inches into the soil. If it feels dry, water thoroughly. If damp, wait 1–2 days.\n"
        "• **Morning Routine:** Water early in the morning so excess moisture on foliage evaporates in the daytime sun.\n"
        "• **Drainage Check:** Always ensure the pot has drainage holes. Overwatering (soggy soil) causes root rot, the #1 killer of houseplants!\n"
        "• **Base Watering:** Direct water at the root base, not on the foliage to avoid fungal infections."
    ),
    "yellow": (
        "🍂 **Why Leaves Turn Yellow (Chlorosis):**\n\n"
        "1. **Overwatering:** Most common! Roots suffocate and cannot absorb nutrients. Soil stays soggy.\n"
        "2. **Underwatering:** Leaves will look droopy, crisp at edges, and soil shrinks from pot walls.\n"
        "3. **Nitrogen Deficiency:** Older lower leaves turn pale yellow first while veins stay light.\n"
        "4. **Low Sunlight:** The plant cannot photosynthesize effectively; move closer to indirect sunlight.\n"
        "• *Quick Fix:* Check moisture level, trim dead yellow leaves with clean scissors, and ensure bright indirect light."
    ),
    "sun": (
        "☀️ **Sunlight Requirements Guide:**\n\n"
        "• **Full Sun (6–8+ hours direct):** Tomatoes, Peppers, Corn, Basil, Succulents, Cacti.\n"
        "• **Bright Indirect Light:** Money Plant (Pothos), Monstera, Spider Plant, Peace Lily.\n"
        "• **Low to Medium Light:** Snake Plant, ZZ Plant, Cast Iron Plant.\n"
        "• *Tip:* If leaves look bleached or brown crispy, it's getting too much harsh direct sun. If stems become long and leggy, it needs more light!"
    ),
    "fertilizer": (
        "🧪 **Fertilizer & Nutrition Guide:**\n\n"
        "• **NPK Balance:**\n"
        "  - **N (Nitrogen):** Foliage and leaf growth.\n"
        "  - **P (Phosphorus):** Root development and flower/fruit set.\n"
        "  - **K (Potassium):** Overall disease resistance and fruit quality.\n"
        "• **Rule of Thumb:** Feed during active growing season (Spring/Summer) every 2–4 weeks with half-strength diluted fertilizer.\n"
        "• **Organic Options:** Vermicompost, well-rotted cow manure, seaweed extract, or crushed eggshells (for calcium)."
    ),
    "curl": (
        "🍃 **Why Plant Leaves Curl:**\n\n"
        "• **Upward Curling:** Heat stress or intense direct sunlight trying to minimize surface exposure.\n"
        "• **Downward Cupping:** Overwatering, cold drafts, or heavy nitrogen over-fertilization.\n"
        "• **Distorted / Puckered:** Pests like aphids or spider mites sucking sap from the underside of leaves, or viral leaf curl.\n"
        "• *Remedy:* Inspect under leaves with a magnifying glass, move to dappled light, and maintain consistent soil moisture."
    ),
    "pest": (
        "🐛 **Natural Pest Defense & Treatment:**\n\n"
        "• **Neem Oil Spray:** Mix 1 tsp pure cold-pressed neem oil + 1/2 tsp mild liquid dish soap in 1 liter of warm water. Spray top and bottom of leaves every 7 days.\n"
        "• **Aphids & Spider Mites:** Blast with a gentle stream of water to knock them off, then apply neem spray.\n"
        "• **Mealybugs:** Dab individual white cottony bugs with a cotton swab dipped in 70% rubbing alcohol.\n"
        "• **Fungus Gnats:** Allow top 2 inches of soil to dry between waterings, and use yellow sticky traps."
    )
}


def get_gemini_api_key() -> Optional[str]:
    """Retrieves GEMINI_API_KEY from environment or returns None."""
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if key and key != "your_gemini_api_key_here":
        return key
    return None


def generate_local_response(user_query: str, plant_context: Optional[str] = None) -> str:
    """
    Generates intelligent local botanical response based on query keywords
    when the Gemini API key is not yet set up.
    """
    q = user_query.lower()
    matched_sections = []

    if any(k in q for k in ["water", "hydration", "damp", "dry", "irrigate", "frequency"]):
        matched_sections.append(LOCAL_FALLBACK_KNOWLEDGE["water"])
    if any(k in q for k in ["yellow", "pale", "chlorosis", "color"]):
        matched_sections.append(LOCAL_FALLBACK_KNOWLEDGE["yellow"])
    if any(k in q for k in ["sun", "light", "shade", "dark", "window"]):
        matched_sections.append(LOCAL_FALLBACK_KNOWLEDGE["sun"])
    if any(k in q for k in ["fertilizer", "nutrient", "feed", "npk", "compost", "manure"]):
        matched_sections.append(LOCAL_FALLBACK_KNOWLEDGE["fertilizer"])
    if any(k in q for k in ["curl", "wrinkle", "twist", "deform"]):
        matched_sections.append(LOCAL_FALLBACK_KNOWLEDGE["curl"])
    if any(k in q for k in ["pest", "bug", "insect", "aphid", "mite", "whitefly", "fungus"]):
        matched_sections.append(LOCAL_FALLBACK_KNOWLEDGE["pest"])

    prefix = ""
    if plant_context:
        prefix = f"🌿 **Care guidance for {plant_context}:**\n\n"

    if matched_sections:
        response_body = "\n\n".join(matched_sections)
    else:
        # Default helpful general advice
        response_body = (
            "🌿 **General Plant Health Tips:**\n\n"
            "• **Observation:** Inspect your plant's foliage twice a week for changes in leaf texture or spots.\n"
            "• **Watering:** Wait until the top inch of soil is dry before watering; never let roots sit in standing saucer water.\n"
            "• **Light:** Provide bright indirect sunlight for balanced chlorophyll production.\n"
            "• **Air Flow:** Ensure moderate room ventilation to prevent fungal spore settlement."
        )

    notice = (
        "\n\n---\n"
        "*ℹ️ [Note: Running on built-in botanical knowledge base. "
        "To enable live Gemini AI generation, add your free GEMINI_API_KEY in the `.env` file.]*"
    )
    return prefix + response_body + notice


def ask_gemini_plant_assistant(user_query: str, plant_context: Optional[str] = None, chat_history: Optional[List[Dict[str, str]]] = None) -> str:
    """
    Interacts with Google Gemini using the `google-genai` SDK.
    Falls back cleanly to local knowledge base if API key is absent or network fails.
    """
    api_key = get_gemini_api_key()

    if not api_key:
        return generate_local_response(user_query, plant_context)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        # Build prompt with plant context
        context_str = f"Current Focus Plant: {plant_context}\n" if plant_context else ""
        prompt_content = f"{context_str}User Question: {user_query}"

        # Standard modern model as recommended in Gemini guidelines
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt_content,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=600
            )
        )

        if response and response.text:
            return response.text
        else:
            return generate_local_response(user_query, plant_context)

    except Exception as e:
        print(f"[Notice] Gemini API call returned exception: {e}")
        # Return local response so user still receives immediate helpful answer
        local_ans = generate_local_response(user_query, plant_context)
        return local_ans
