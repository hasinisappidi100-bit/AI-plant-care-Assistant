# 🌱 AI PlantCare Assistant

> **“Your intelligent companion for healthier plants.”**  
> *An Applied Artificial Intelligence, Computer Vision, and Botanical Health Platform.*

---

## 📖 1. Project Description

**AI PlantCare Assistant** is an end-to-end, beginner-friendly web application designed to help farmers, gardening enthusiasts, and students identify plants, diagnose leaf diseases from photos, access structured care protocols (watering, sunlight, soil, fertilizers), and interact with an AI-powered botanical doctor via a conversational chatbot.

The project pairs **Deep Learning (Convolutional Neural Networks with TensorFlow/Keras)** trained on the benchmark **PlantVillage dataset** with **Large Language Models (Google Gemini via `google-genai`)** and an intuitive, nature-inspired **Streamlit** user interface.

---

## ✨ 2. Key Features

- **🌿 Plant Identification & Leaf Pathology:**
  - Upload leaf images (`.jpg`, `.jpeg`, `.png`) to identify plant species and detect diseases (e.g., Tomato Early Blight, Potato Late Blight, Apple Scab).
  - Preprocessing pipeline using **Pillow** and **OpenCV** (aspect-ratio resizing, normalization, blur detection, greenness color index).
  - Clear confidence scores with a transparent **Safe Demo Mode** fallback when the physical model file is not present.
- **💧 Smart Botanical Care Engine:**
  - Structured guidance for watering frequency, sunlight requirements, soil composition, ideal temperature ranges, pruning, and fertilizer routines.
  - Built-in local dictionary and CSV repository (`data/plant_data.csv`) ensuring 100% offline availability.
- **🤖 Ask PlantCare AI (Chatbot):**
  - Powered by **Google Gemini API** (`gemini-3.8-flash`).
  - Contextually aware of the currently diagnosed plant species.
  - Preset quick-ask buttons for common questions (yellow leaves, watering cycles, pest protection).
  - Robust local botanical fallback if the API key is not configured.
- **📊 Plant Health Dashboard:**
  - Visual metrics: plant name, prediction confidence, condition status, and growth parameters.
  - Matplotlib chart displaying a **7-Day Weekly Plant Care Schedule**.
- **ℹ️ Academic Documentation & Viva Preparation:**
  - Complete architecture walkthrough, dataset specs, and viva voce question-and-answer revision bank.

---

## 🛠️ 3. Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | Python | `3.11.9` | Primary execution runtime |
| **Web Framework** | Streamlit | `>=1.40, <2` | Interactive, responsive web UI |
| **Deep Learning** | TensorFlow / Keras | `>=2.18, <3` / `>=3.5, <4` | CNN leaf image classification |
| **Computer Vision** | OpenCV & Pillow | `>=4.10, <5` / `>=10, <13` | Image decoding, resizing, color analysis |
| **Generative AI** | Google Gemini (`google-genai`) | `>=1.0, <2` | Conversational botanical chatbot |
| **Data & Arrays** | Pandas & NumPy | `>=2.2, <3` / `>=1.26, <3` | Tabular database & tensor manipulation |
| **Plotting** | Matplotlib | `>=3.9, <4` | Visualizing 7-day care schedule |
| **Environment** | python-dotenv | `>=1.0, <2` | Secure API key management |

---

## 🔄 4. System Workflow

```text
[User Uploads Leaf Image (JPG/PNG)]
                 │
                 ▼
[Image Preprocessing (Pillow & OpenCV)]
  - Resize to (224, 224, 3)
  - Normalize pixel values [0, 1]
  - OpenCV blur & green-ratio test
                 │
                 ▼
[TensorFlow/Keras CNN Model (PlantVillage)]
  - Evaluates feature maps
  - Computes Softmax class probabilities
  - (Safe Demo Mode if model file is absent)
                 │
                 ▼
[Diagnostic Results Displayed]
  - Plant Name & Disease Condition
  - Confidence Percentage (%)
  - Health Badge (Healthy / Diseased / Pest)
                 │
                 ├───────────────────────────────┐
                 ▼                               ▼
[Care Guidance Engine (plant_data.csv)]   [Ask PlantCare AI (Gemini)]
  - 💧 Watering & ☀️ Sunlight              - Context-grounded chat
  - 🌱 Soil & 🌡️ Temperature               - Yellow leaf troubleshooting
  - 🧪 Fertilizer & ✂️ Pruning             - Organic pest remedies
                 │
                 ▼
[Plant Health Dashboard (Matplotlib Schedule)]
```

---

## 📂 5. Project Directory Structure

```text
AI-PlantCare-Assistant/
│
├── app.py                      # Main Streamlit web application
├── requirements.txt            # Python package dependencies
├── .env                        # Secure environment variables (API keys)
├── .gitignore                  # Git ignore rules
│
├── model/
│   ├── plant_model.keras       # Trained Keras CNN model weights
│   └── README.md               # Model specifications and instructions
│
├── data/
│   └── plant_data.csv          # Local botanical care knowledge base
│
├── utils/
│   ├── plant_data.py           # Data access, mapping, and fallback dictionary
│   ├── image_processing.py     # Pillow/OpenCV preprocessing & inference
│   └── ai_helper.py            # Gemini API integration & fallback chatbot
│
└── README.md                   # Complete documentation & project guide
```

---

## ⚙️ 6. Installation & Execution Guide

### Step 1: Clone or Navigate to the Project Folder
Open your terminal (PowerShell or Command Prompt on Windows, Terminal on macOS/Linux):
```powershell
cd AI-PlantCare-Assistant
```

### Step 2: Create and Activate a Python 3.11 Virtual Environment
On **Windows (PowerShell)**:
```powershell
python -m venv venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\venv\Scripts\Activate.ps1
```

On **Windows (Command Prompt / cmd.exe)**:
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

On **macOS / Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Step 4: Configure the Google Gemini API Key
1. Get a free API key from Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/)
2. Open the `.env` file in VS Code or Notepad:
```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```
*(Note: If you leave this blank, the app will automatically use its built-in botanical knowledge base without crashing!)*

### Step 5: (Optional) Place the Trained Model
If you have trained a Keras model on the PlantVillage dataset:
1. Save your model as `plant_model.keras`.
2. Place it into the `model/` folder: `model/plant_model.keras`.
3. If not placed, the application will automatically engage **Safe Demo Mode**, ensuring smooth demonstration for college reviewers.

### Step 6: Launch the Streamlit Application
```powershell
streamlit run app.py
```
Streamlit will launch local server at:
```text
Local URL: http://localhost:8501
```

---

## 🌿 7. PlantVillage Dataset Overview

- **Source:** PlantVillage Open Access Repository.
- **Contents:** 54,306 labeled agricultural images.
- **Classes:** 38 distinct classes covering 14 crops:
  - *Tomato* (10 classes: Healthy, Early Blight, Late Blight, Septoria, Spider Mites, Leaf Curl Virus, etc.)
  - *Potato* (3 classes: Early Blight, Late Blight, Healthy)
  - *Bell Pepper* (2 classes: Bacterial Spot, Healthy)
  - *Apple* (4 classes: Apple Scab, Black Rot, Cedar Apple Rust, Healthy)
  - *Corn/Maize* (4 classes: Gray Leaf Spot, Common Rust, Northern Blight, Healthy)
  - *Grape, Peach, Strawberry, Squash, Cherry, etc.*
- **Training Process:**
  - 80/20 train-validation split.
  - Data augmentation: Random horizontal flip, rotation ($\pm 15^\circ$), zoom ($\pm 10\%$).
  - Target input resolution: $224 \times 224 \times 3$.
  - Evaluation metric: Top-1 Accuracy ($>95\%$).

---

## 📸 8. Screenshots Placeholder

*(Capture screenshots during your demonstration and place in `docs/screenshots/`)*

1. **Home Screen:** Nature-inspired hero card, workflow indicators, and feature highlights.
2. **Identification Screen:** Uploaded leaf image preview alongside the confidence gauge and health badge.
3. **Care Guide:** Expandable cards displaying watering, sunlight, soil, fertilizer, and pruning specs.
4. **Chatbot:** Live conversational session with Ask PlantCare AI.
5. **Dashboard:** 7-day care schedule chart and plant metrics.

---

## 💡 9. Frequently Asked Technical Questions & Answers

**Q1: What is the main objective of this project?**  
> **Ans:** To develop a lightweight, user-friendly agricultural support platform that combines computer vision (CNN for leaf disease detection) and conversational generative AI (Google Gemini for personalized advice) to assist home gardeners and small-scale farmers in keeping plants healthy.

**Q2: What is the benefit of using Streamlit over Django or Flask?**  
> **Ans:** Streamlit is built specifically for data science and machine learning applications. It allows rapid prototyping in pure Python, provides reactive session state management, native file uploaders, and direct Matplotlib/Plotly integration without requiring complex frontend templates or boilerplate API routing.

**Q3: How does the model preprocess input images?**  
> **Ans:** The image is decoded via Pillow/OpenCV, converted to standard 3-channel RGB, resized using Lanczos resampling to $(224, 224)$, normalized so pixel intensities lie in $[0.0, 1.0]$, and reshaped to include a batch dimension $(1, 224, 224, 3)$.

**Q4: How does the system handle an unavailable model or missing API key?**  
> **Ans:** Resilience is a core engineering feature of this project. If `plant_model.keras` is missing, the app triggers a **Safe Demo Mode** that transparently labels predictions as simulated without crashing. Similarly, if `GEMINI_API_KEY` is not found, the chatbot gracefully switches to a curated local rule-based botanical knowledge base.

---

## 🚀 10. Future Enhancements

1. **IoT Soil Sensor Integration:** Connecting ESP32 / Arduino soil moisture and DHT11 temperature sensors to update the dashboard with live telemetry.
2. **Multilingual Audio Support:** Adding text-to-speech (TTS) in regional languages (Hindi, Telugu, Tamil, etc.) for rural farmers.
3. **On-Device Edge Deployment:** Exporting the Keras model to TensorFlow Lite (`.tflite`) for mobile deployment on Android devices without internet connectivity.

---

## 📜 11. License & Open-Source Attribution
Developed as an intelligent botanical care platform. Released under the Apache 2.0 License.
