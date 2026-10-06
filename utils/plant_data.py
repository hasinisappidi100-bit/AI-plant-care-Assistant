"""
utils/plant_data.py
-------------------
Data access layer for the AI PlantCare Assistant.
Loads botanical care guidelines from CSV or provides built-in fallback data.
Botanical care guidelines for AI PlantCare Assistant.
"""

import os
import pandas as pd
from typing import Dict, Any, List, Optional

# Local path to CSV
DATA_CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "plant_data.csv")

# Built-in robust fallback dictionary in case CSV file is relocated or missing
DEFAULT_PLANT_DATABASE: Dict[str, Dict[str, Any]] = {
    "Tomato": {
        "plant_name": "Tomato",
        "scientific_name": "Solanum lycopersicum",
        "category": "Vegetable",
        "watering": "Water deeply 2–3 times a week when top 1–2 inches of soil feel dry. Water the base, not foliage.",
        "sunlight": "Full Sun: 6–8 hours of direct daily sunlight.",
        "soil": "Well-drained, fertile loamy soil with pH 6.0–6.8 and rich organic compost.",
        "temperature": "18°C – 29°C (65°F – 85°F). Sensitive to frost.",
        "fertilizer": "Balanced 10-10-10 early; high potassium and phosphorus during fruiting every 2 weeks.",
        "pruning": "Pinch suckers in leaf axils and remove yellowing bottom foliage for ventilation.",
        "common_problems": "Early blight, blossom end rot, tomato hornworms, leaf curling from erratic watering.",
        "schedule": {
            "Monday": "Deep root watering 💧",
            "Tuesday": "Sunlight & leaf inspection ☀️",
            "Wednesday": "Prune suckers & yellow leaves ✂️",
            "Thursday": "Light soil moisture check 💧",
            "Friday": "Balanced organic fertilizer 🧪",
            "Saturday": "Inspect undersides for pests 🔍",
            "Sunday": "Natural soil aeration & rest 🌱"
        }
    },
    "Potato": {
        "plant_name": "Potato",
        "scientific_name": "Solanum tuberosum",
        "category": "Vegetable",
        "watering": "Water consistently; keep soil evenly moist (about 1–2 inches per week).",
        "sunlight": "Full Sun: 6+ hours of direct sunlight.",
        "soil": "Loose, well-aerated sandy loam with pH 5.0–6.0. Hill up soil over growing tubers.",
        "temperature": "15°C – 21°C (60°F – 70°F). Cool-season crop.",
        "fertilizer": "Low nitrogen, higher phosphorus and potassium (5-10-10) every 3 weeks.",
        "pruning": "No heavy pruning. Hill soil 6–8 inches high around stems as plants grow.",
        "common_problems": "Late blight, potato beetles, scab disease, green tubers from sun exposure.",
        "schedule": {
            "Monday": "Moderate hill watering 💧",
            "Tuesday": "Check for potato beetles 🔍",
            "Wednesday": "Hill up soil around stems 🌿",
            "Thursday": "Check soil dampness 💧",
            "Friday": "Phosphorus-rich fertilizer 🧪",
            "Saturday": "Inspect leaf color & blight signs ☀️",
            "Sunday": "Rest day 🌱"
        }
    },
    "Bell Pepper": {
        "plant_name": "Bell Pepper",
        "scientific_name": "Capsicum annuum",
        "category": "Vegetable",
        "watering": "Water 1–2 inches per week; keep soil moist but never soggy.",
        "sunlight": "Full Sun: 6–8 hours of direct warm sunlight.",
        "soil": "Well-draining, rich loamy soil with compost and pH 6.2–7.0.",
        "temperature": "21°C – 29°C (70°F – 85°F). Protect from cold drafts.",
        "fertilizer": "Balanced 5-10-10 or tomato feed with magnesium every 2 weeks after flowering.",
        "pruning": "Pinch early flowers to encourage bushy growth; stake heavy fruit-bearing branches.",
        "common_problems": "Bacterial leaf spot, blossom end rot, sunscald on fruit, aphids.",
        "schedule": {
            "Monday": "Deep soil hydration 💧",
            "Tuesday": "Rotate plant towards sunlight ☀️",
            "Wednesday": "Stake tall branches & pinch tips ✂️",
            "Thursday": "Check drainage & soil moisture 💧",
            "Friday": "Magnesium/calcium organic feed 🧪",
            "Saturday": "Check for aphids under leaves 🔍",
            "Sunday": "Rest & observation 🌱"
        }
    },
    "Apple": {
        "plant_name": "Apple",
        "scientific_name": "Malus domestica",
        "category": "Fruit Tree",
        "watering": "Deep soak every 7–10 days during dry spells; 1 inch of water weekly.",
        "sunlight": "Full Sun: 6–8 hours of uninterrupted sunlight.",
        "soil": "Well-drained loam to sandy loam with pH 6.0–7.0.",
        "temperature": "10°C – 24°C (50°F – 75°F); requires winter chill hours.",
        "fertilizer": "Fruit tree fertilizer (10-10-10) in early spring; avoid late season nitrogen.",
        "pruning": "Prune dormant branches in winter to open tree canopy to sunlight.",
        "common_problems": "Apple scab fungus, cedar apple rust, codling moth, powdery mildew.",
        "schedule": {
            "Monday": "Deep basin irrigation 💧",
            "Tuesday": "Check canopy for fungal spots 🔍",
            "Wednesday": "Remove dead twigs or water sprouts ✂️",
            "Thursday": "Soil mulch inspection 💧",
            "Friday": "Apply compost or fruit feed (seasonal) 🧪",
            "Saturday": "Inspect bark and leaf health ☀️",
            "Sunday": "Rest day 🌱"
        }
    },
    "Money Plant (Pothos)": {
        "plant_name": "Money Plant (Pothos)",
        "scientific_name": "Epipremnum aureum",
        "category": "Indoor / Foliage",
        "watering": "Water every 1–2 weeks when top 2 inches of soil feel completely dry.",
        "sunlight": "Bright indirect light; tolerates medium to low light, avoid harsh sun.",
        "soil": "Well-draining indoor potting mix with perlite and peat moss.",
        "temperature": "18°C – 30°C (65°F – 86°F). Protect from AC drafts.",
        "fertilizer": "Diluted balanced liquid houseplant fertilizer once a month during spring/summer.",
        "pruning": "Trim long vining stems to encourage bushier growth; wipe leaves with damp cloth.",
        "common_problems": "Root rot from overwatering, yellowing leaves, mealybugs, leggy vines.",
        "schedule": {
            "Monday": "Moderate watering 💧",
            "Tuesday": "Wipe dust off broad leaves 🍃",
            "Wednesday": "Trim leggy trailing vines ✂️",
            "Thursday": "Check soil dampness 🌱",
            "Friday": "Half-strength liquid feed (monthly) 🧪",
            "Saturday": "Check leaf nodes for mealybugs 🔍",
            "Sunday": "Rest & indirect light day ☀️"
        }
    },
    "Snake Plant": {
        "plant_name": "Snake Plant",
        "scientific_name": "Sansevieria trifasciata",
        "category": "Indoor / Succulent",
        "watering": "Water very sparingly; once every 2–4 weeks. Soil must dry out 100%.",
        "sunlight": "Adaptable: thrives in indirect light, tolerates low light.",
        "soil": "Cactus or succulent potting mix with coarse sand and pumice.",
        "temperature": "15°C – 29°C (60°F – 85°F). Not cold hardy.",
        "fertilizer": "Feed once in spring and once in summer with mild succulent fertilizer.",
        "pruning": "Rarely needed; cut damaged outer leaves at soil line with sterile blade.",
        "common_problems": "Root rot from overwatering (mushy leaves), brown dry tips from underwatering.",
        "schedule": {
            "Monday": "Check soil dryness (water only if bone dry) 💧",
            "Tuesday": "Dust upright sword leaves 🌿",
            "Wednesday": "Rotate pot 90 degrees for even light ☀️",
            "Thursday": "No water needed 🌱",
            "Friday": "Mild cactus fertilizer (rare) 🧪",
            "Saturday": "Inspect leaf bases 🔍",
            "Sunday": "Complete rest day 🌱"
        }
    },
    "Tulsi (Holy Basil)": {
        "plant_name": "Tulsi (Holy Basil)",
        "scientific_name": "Ocimum tenuiflorum",
        "category": "Medicinal / Herb",
        "watering": "Water daily in summer or when topsoil feels dry. Avoid waterlogging.",
        "sunlight": "Bright direct sunlight for 4–6 hours every day.",
        "soil": "Rich, loamy, well-drained soil with organic vermicompost, pH 6.0–7.5.",
        "temperature": "20°C – 35°C (68°F – 95°F). Highly sensitive to cold and frost.",
        "fertilizer": "Organic vermicompost or cow dung manure once every month.",
        "pruning": "Pinch off flower buds (manjari) regularly to keep plant bushy.",
        "common_problems": "Leaf spot, root rot from stagnant water, spider mites, cold wilt.",
        "schedule": {
            "Monday": "Morning gentle watering 💧",
            "Tuesday": "Morning sun positioning ☀️",
            "Wednesday": "Pinch top flower buds (manjari) ✂️",
            "Thursday": "Moisture & leaf check 💧",
            "Friday": "Vermicompost boost (monthly) 🧪",
            "Saturday": "Inspect leaves for tiny mites 🔍",
            "Sunday": "Rest day 🌱"
        }
    }
}

# Mapping of PlantVillage class predictions to common plant names and health status
PLANTVILLAGE_CLASSES_MAP = {
    "Apple___Apple_scab": {"plant": "Apple", "health": "Diseased", "condition": "Apple Scab (Venturia inaequalis)"},
    "Apple___Black_rot": {"plant": "Apple", "health": "Diseased", "condition": "Black Rot Fungus"},
    "Apple___Cedar_apple_rust": {"plant": "Apple", "health": "Diseased", "condition": "Cedar Apple Rust"},
    "Apple___healthy": {"plant": "Apple", "health": "Healthy", "condition": "Healthy Foliage"},
    "Corn_(maize)___Cercospora_leaf_spot": {"plant": "Corn (Maize)", "health": "Diseased", "condition": "Gray Leaf Spot"},
    "Corn_(maize)___Common_rust_": {"plant": "Corn (Maize)", "health": "Diseased", "condition": "Common Rust Fungus"},
    "Corn_(maize)___healthy": {"plant": "Corn (Maize)", "health": "Healthy", "condition": "Healthy Foliage"},
    "Grape___Black_rot": {"plant": "Grape", "health": "Diseased", "condition": "Grape Black Rot"},
    "Grape___Esca_(Black_Measles)": {"plant": "Grape", "health": "Diseased", "condition": "Esca / Black Measles"},
    "Grape___healthy": {"plant": "Grape", "health": "Healthy", "condition": "Healthy Foliage"},
    "Peach___Bacterial_spot": {"plant": "Peach", "health": "Diseased", "condition": "Bacterial Spot"},
    "Peach___healthy": {"plant": "Peach", "health": "Healthy", "condition": "Healthy Foliage"},
    "Pepper,_bell___Bacterial_spot": {"plant": "Bell Pepper", "health": "Diseased", "condition": "Bacterial Leaf Spot"},
    "Pepper,_bell___healthy": {"plant": "Bell Pepper", "health": "Healthy", "condition": "Healthy Foliage"},
    "Potato___Early_blight": {"plant": "Potato", "health": "Diseased", "condition": "Early Blight (Alternaria solani)"},
    "Potato___Late_blight": {"plant": "Potato", "health": "Diseased", "condition": "Late Blight (Phytophthora infestans)"},
    "Potato___healthy": {"plant": "Potato", "health": "Healthy", "condition": "Healthy Foliage"},
    "Strawberry___Leaf_scorch": {"plant": "Strawberry", "health": "Diseased", "condition": "Leaf Scorch Fungus"},
    "Strawberry___healthy": {"plant": "Strawberry", "health": "Healthy", "condition": "Healthy Foliage"},
    "Tomato___Bacterial_spot": {"plant": "Tomato", "health": "Diseased", "condition": "Bacterial Spot"},
    "Tomato___Early_blight": {"plant": "Tomato", "health": "Diseased", "condition": "Early Blight (Alternaria solani)"},
    "Tomato___Late_blight": {"plant": "Tomato", "health": "Diseased", "condition": "Late Blight (Phytophthora infestans)"},
    "Tomato___Leaf_Mold": {"plant": "Tomato", "health": "Diseased", "condition": "Leaf Mold Fungus"},
    "Tomato___Septoria_leaf_spot": {"plant": "Tomato", "health": "Diseased", "condition": "Septoria Leaf Spot"},
    "Tomato___Spider_mites": {"plant": "Tomato", "health": "Pest Infestation", "condition": "Two-spotted Spider Mite"},
    "Tomato___Target_Spot": {"plant": "Tomato", "health": "Diseased", "condition": "Target Spot"},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {"plant": "Tomato", "health": "Viral Disease", "condition": "Yellow Leaf Curl Virus"},
    "Tomato___Tomato_mosaic_virus": {"plant": "Tomato", "health": "Viral Disease", "condition": "Mosaic Virus"},
    "Tomato___healthy": {"plant": "Tomato", "health": "Healthy", "condition": "Healthy Foliage"}
}


def load_plant_database() -> Dict[str, Dict[str, Any]]:
    """
    Loads plant database from CSV file with safe fallback.
    Returns a dictionary mapping plant_name -> details dict.
    """
    database: Dict[str, Dict[str, Any]] = dict(DEFAULT_PLANT_DATABASE)

    if os.path.exists(DATA_CSV_PATH):
        try:
            df = pd.read_csv(DATA_CSV_PATH)
            for _, row in df.iterrows():
                p_name = str(row.get("plant_name", "")).strip()
                if not p_name:
                    continue

                database[p_name] = {
                    "plant_name": p_name,
                    "scientific_name": str(row.get("scientific_name", "")),
                    "category": str(row.get("category", "General Plant")),
                    "watering": str(row.get("watering", "Water moderately when soil is dry.")),
                    "sunlight": str(row.get("sunlight", "Moderate to bright sunlight.")),
                    "soil": str(row.get("soil", "Well-drained potting soil.")),
                    "temperature": str(row.get("temperature", "18°C – 28°C")),
                    "fertilizer": str(row.get("fertilizer", "Balanced plant fertilizer monthly.")),
                    "pruning": str(row.get("pruning", "Remove yellow or dead leaves.")),
                    "common_problems": str(row.get("common_problems", "Overwatering, low light, common pests.")),
                    "schedule": {
                        "Monday": str(row.get("schedule_monday", "Water 💧")),
                        "Tuesday": str(row.get("schedule_tuesday", "Sunlight ☀️")),
                        "Wednesday": str(row.get("schedule_wednesday", "Check leaves 🌿")),
                        "Thursday": str(row.get("schedule_thursday", "Water 💧")),
                        "Friday": str(row.get("schedule_friday", "Fertilizer 🧪")),
                        "Saturday": str(row.get("schedule_saturday", "Check pests 🔍")),
                        "Sunday": str(row.get("schedule_sunday", "Rest 🌱"))
                    }
                }
        except Exception as e:
            # Fallback to hardcoded database if CSV parsing encounters issue
            print(f"[Warning] Could not parse CSV, using default database: {e}")

    return database


def get_all_plant_names() -> List[str]:
    """Returns a sorted list of all available plant names."""
    db = load_plant_database()
    return sorted(list(db.keys()))


def get_plant_info(plant_name: str) -> Dict[str, Any]:
    """
    Retrieves full care details for a given plant name.
    Matches case-insensitively or via substring if needed.
    """
    db = load_plant_database()

    # Direct match
    if plant_name in db:
        return db[plant_name]

    # Case-insensitive match
    for name, info in db.items():
        if name.lower() == plant_name.lower():
            return info

    # Substring match (e.g. "Tomato Leaf" -> "Tomato")
    for name, info in db.items():
        if name.lower() in plant_name.lower() or plant_name.lower() in name.lower():
            return info

    # Default to Tomato if not found
    return db.get("Tomato", list(db.values())[0])


def get_plantvillage_details(raw_class: str) -> Dict[str, str]:
    """
    Parses a PlantVillage raw label into friendly plant name, health status, and condition.
    """
    if raw_class in PLANTVILLAGE_CLASSES_MAP:
        return PLANTVILLAGE_CLASSES_MAP[raw_class]

    # Heuristic parsing for arbitrary class names
    cleaned = raw_class.replace("___", " - ").replace("_", " ")
    parts = cleaned.split(" - ")
    plant = parts[0] if len(parts) > 0 else "Unknown Plant"
    condition = parts[1] if len(parts) > 1 else "Standard Foliage"
    health = "Healthy" if "healthy" in raw_class.lower() else "Needs Attention"

    return {
        "plant": plant,
        "health": health,
        "condition": condition
    }
