"""
app.py
------
AI PlantCare Assistant - Streamlit Web Application
Technologies: Python 3.11.9, Streamlit, TensorFlow/Keras, OpenCV, Pillow, Google Gemini API, Pandas, Matplotlib

Run command:
    streamlit run app.py
"""

import os
import io
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Import custom utilities
from utils.plant_data import (
    load_plant_database,
    get_all_plant_names,
    get_plant_info
)
from utils.image_processing import (
    predict_plant_image,
    is_model_available,
    analyze_image_opencv
)
from utils.ai_helper import (
    ask_gemini_plant_assistant,
    get_gemini_api_key
)

# ---------------------------------------------------------
# Page Configuration & Styling
# ---------------------------------------------------------
st.set_page_config(
    page_title="AI PlantCare Assistant",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Nature-inspired CSS theme (Emerald, White, Slate)
st.markdown("""
<style>
    /* Main container background */
    .stApp {
        background-color: #f7faf7;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Nature-inspired rounded card */
    .plant-card {
        background-color: #ffffff;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 14px rgba(22, 101, 52, 0.08);
        border: 1px solid #dcfce7;
        margin-bottom: 20px;
    }

    /* Highlight badges */
    .badge-healthy {
        background-color: #dcfce7;
        color: #15803d;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.88rem;
        display: inline-block;
    }
    .badge-warning {
        background-color: #fef3c7;
        color: #b45309;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.88rem;
        display: inline-block;
    }
    .badge-demo {
        background-color: #e0e7ff;
        color: #4338ca;
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.88rem;
        display: inline-block;
    }

    /* Headings */
    h1, h2, h3 {
        color: #14532d;
    }
    
    /* Custom buttons */
    div.stButton > button {
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.2s ease-in-out;
    }
    div.stButton > button:hover {
        border-color: #16a34a;
        color: #16a34a;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Session State Initialization
# ---------------------------------------------------------
if "current_plant" not in st.session_state:
    st.session_state.current_plant = "Tomato"
if "prediction_result" not in st.session_state:
    st.session_state.prediction_result = None
if "uploaded_image" not in st.session_state:
    st.session_state.uploaded_image = None
if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = [
        {
            "role": "assistant",
            "content": "👋 Hello! I am your **PlantCare AI** assistant. Ask me anything about watering schedules, yellow leaves, pests, or fertilizers for your plants!"
        }
    ]

# ---------------------------------------------------------
# Sidebar Navigation
# ---------------------------------------------------------
st.sidebar.markdown("""
<div style="text-align: center; padding: 12px 0 20px 0;">
    <h2 style="color: #166534; margin-bottom: 2px;">🌱 AI PlantCare</h2>
    <p style="color: #4b5563; font-size: 0.85rem; margin: 0;">Smart Botanical Companion</p>
</div>
""", unsafe_allow_html=True)

menu_options = [
    "🏠 Home",
    "🔍 Plant Identification",
    "🌱 Plant Care",
    "🤖 Ask PlantCare AI",
    "📊 Plant Health Dashboard",
    "ℹ️ About Project"
]

# Set page navigation
page_choice = st.sidebar.radio("Navigate Pages", menu_options, index=0)

# Sidebar System Status Box
st.sidebar.markdown("---")
model_ready = is_model_available()
api_ready = get_gemini_api_key() is not None

st.sidebar.markdown("### ⚙️ System Status")
if model_ready:
    st.sidebar.success("✅ Keras CNN Model: Active")
else:
    st.sidebar.info("💡 ML Model: Demo Mode Active")

if api_ready:
    st.sidebar.success("✅ Gemini AI: Connected")
else:
    st.sidebar.warning("⚠️ Gemini: Using Local KB (.env)")

st.sidebar.markdown("---")
st.sidebar.caption("🌱 Intelligent Plant Health Platform")
st.sidebar.caption("Dataset: PlantVillage (38 Classes)")


# =========================================================
# PAGE 1: 🏠 HOME
# =========================================================
if page_choice == "🏠 Home":
    st.markdown("""
    <div style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 36px; border-radius: 20px; color: white; margin-bottom: 28px;">
        <h1 style="color: white; margin: 0; font-size: 2.4rem;">🌱 AI PlantCare Assistant</h1>
        <p style="font-size: 1.15rem; color: #bbf7d0; margin-top: 8px; margin-bottom: 0;">
            “Your intelligent companion for healthier plants.”
        </p>
        <p style="margin-top: 14px; font-size: 0.95rem; color: #f0fdf4; max-width: 750px; line-height: 1.6;">
            A simple and powerful botanical health system. Upload any leaf or plant photo to diagnose diseases,
            get personalized soil & watering care guides, and chat with our AI plant doctor in real-time.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Workflow Section
    st.markdown("### 🔄 How It Works")
    st.markdown("""
    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;">
        <div style="flex: 1; min-width: 180px; background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #22c55e; border: 1px solid #e2e8f0;">
            <strong>Step 1: Upload 📸</strong>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">Upload a clear leaf photo (JPG/PNG).</p>
        </div>
        <div style="flex: 1; min-width: 180px; background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #16a34a; border: 1px solid #e2e8f0;">
            <strong>Step 2: Analyze 🧠</strong>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">Keras CNN processes leaf patterns.</p>
        </div>
        <div style="flex: 1; min-width: 180px; background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #15803d; border: 1px solid #e2e8f0;">
            <strong>Step 3: Identify 🔍</strong>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">Detects plant species & disease state.</p>
        </div>
        <div style="flex: 1; min-width: 180px; background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #14532d; border: 1px solid #e2e8f0;">
            <strong>Step 4: Care Tips 🌱</strong>
            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b;">Get custom watering, soil, & fertilizer tips.</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Feature Cards Grid
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        <div class="plant-card">
            <h3>🌿 Plant Identification</h3>
            <p style="color: #4b5563; line-height: 1.5;">
                Classifies plant species and detects common fungal, bacterial, and pest diseases using deep learning trained on the PlantVillage dataset.
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="plant-card">
            <h3>🤖 AI Plant Assistant</h3>
            <p style="color: #4b5563; line-height: 1.5;">
                Ask questions to <strong>Ask PlantCare AI</strong> powered by Google Gemini. Receive expert answers on yellow leaves, pruning, and organic pesticides.
            </p>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div class="plant-card">
            <h3>💧 Smart Care Recommendations</h3>
            <p style="color: #4b5563; line-height: 1.5;">
                Instant instructions for watering volume, direct vs indirect sunlight, potting soil mixtures, temperature thresholds, and seasonal fertilizing.
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="plant-card">
            <h3>📊 Plant Health Dashboard</h3>
            <p style="color: #4b5563; line-height: 1.5;">
                A clean visualization board featuring care metrics, disease severity levels, and a 7-day weekly schedule chart.
            </p>
        </div>
        """, unsafe_allow_html=True)

    # Call to action
    st.markdown("<br>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        if st.button("🚀 Start Plant Analysis Now", type="primary", use_container_width=True):
            st.info("👈 Please select **'🔍 Plant Identification'** in the sidebar to upload your photo!")


# =========================================================
# PAGE 2: 🔍 PLANT IDENTIFICATION
# =========================================================
elif page_choice == "🔍 Plant Identification":
    st.title("🔍 Plant Leaf Identification & Disease Diagnosis")
    st.write("Upload a leaf image to classify the plant species and verify its health condition.")

    col_up, col_res = st.columns([1, 1], gap="large")

    with col_up:
        st.markdown("### 📤 Upload Leaf Photo")
        uploaded_file = st.file_uploader(
            "Choose a JPG, JPEG, or PNG image",
            type=["jpg", "jpeg", "png"],
            help="Take a clear close-up picture of the leaf under good lighting."
        )

        # Quick Demo Buttons so students can demonstrate in college without looking for leaf photos
        st.markdown("#### ⚡ Quick Demo Sample Leaves")
        demo_cols = st.columns(3)
        sample_choice = None
        with demo_cols[0]:
            if st.button("🍅 Tomato (Healthy)", use_container_width=True):
                sample_choice = "Tomato___healthy"
        with demo_cols[1]:
            if st.button("🍂 Potato (Blight)", use_container_width=True):
                sample_choice = "Potato___Late_blight"
        with demo_cols[2]:
            if st.button("🫑 Pepper (Spot)", use_container_width=True):
                sample_choice = "Pepper,_bell___Bacterial_spot"

        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            st.session_state.uploaded_image = image
            st.image(image, caption="Uploaded Leaf Image", use_container_width=True)

            # Analyze image statistics with OpenCV
            image_bytes = uploaded_file.getvalue()
            cv_stats = analyze_image_opencv(image_bytes)
            if cv_stats.get("is_blurry"):
                st.warning("⚠️ Note: Image appears slightly blurry. For optimal classification, keep camera steady.")

        elif sample_choice is not None:
            # Create synthetic demo sample image with PIL
            demo_img = Image.new("RGB", (224, 224), color=(34, 139, 34))
            st.session_state.uploaded_image = demo_img
            st.image(demo_img, caption=f"Sample: {sample_choice}", use_container_width=True)

    with col_res:
        st.markdown("### 📋 Prediction Results")

        target_input = uploaded_file if uploaded_file is not None else st.session_state.uploaded_image

        if target_input is not None:
            with st.spinner("Analyzing leaf with Deep Learning model..."):
                result = predict_plant_image(target_input)
                st.session_state.prediction_result = result
                if not result.get("error"):
                    st.session_state.current_plant = result["plant_name"]

            if result.get("error"):
                st.error(result.get("message"))
            else:
                # Result presentation card
                plant_name = result["plant_name"]
                condition = result["condition"]
                confidence = result["confidence"]
                health_status = result["health_status"]
                is_demo = result["is_demo"]

                # Badge selection
                badge_class = "badge-healthy" if health_status == "Healthy" else "badge-warning"

                st.markdown(f"""
                <div class="plant-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span class="{badge_class}">{health_status.upper()}</span>
                        {"<span class='badge-demo'>DEMO / SIMULATED ML</span>" if is_demo else "<span class='badge-healthy'>PHYSICAL KERAS CNN</span>"}
                    </div>
                    <h2 style="margin: 0; color: #14532d;">{plant_name}</h2>
                    <h4 style="color: #4b5563; margin-top: 4px; font-weight: 500;">Condition: {condition}</h4>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 1rem; color: #374151;">Prediction Confidence:</span>
                        <span style="font-size: 1.4rem; font-weight: 700; color: #15803d;">{confidence}%</span>
                    </div>
                    <div style="background-color: #f1f5f9; border-radius: 8px; height: 10px; width: 100%; margin-top: 8px; overflow: hidden;">
                        <div style="background-color: #22c55e; height: 100%; width: {min(confidence, 100.0)}%;"></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

                if is_demo:
                    st.info("ℹ️ **Model Status:** Plant AI model (`model/plant_model.keras`) is not installed yet. Safe Demo mode is active. See README.md on how to place your trained model file.")

                # Direct action shortcuts
                st.markdown("#### Next Steps:")
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    st.success(f"🌱 Care tips for **{plant_name}** are loaded in the **Plant Care** tab.")
                with btn_col2:
                    st.info(f"🤖 You can ask **Ask PlantCare AI** specific questions about **{condition}**.")
        else:
            st.info("👈 Please upload an image on the left or click one of the quick sample buttons to test identification.")


# =========================================================
# PAGE 3: 🌱 PLANT CARE
# =========================================================
elif page_choice == "🌱 Plant Care":
    st.title("🌱 Botanical Care & Maintenance Guide")
    st.write("Comprehensive watering, sunlight, soil, fertilizer, and pruning guidelines for your plants.")

    # Select Plant
    all_plants = get_all_plant_names()
    default_index = 0
    if st.session_state.current_plant in all_plants:
        default_index = all_plants.index(st.session_state.current_plant)

    selected_plant = st.selectbox(
        "Select or Search Plant Species:",
        all_plants,
        index=default_index
    )
    st.session_state.current_plant = selected_plant

    # Fetch Care Information
    info = get_plant_info(selected_plant)

    # Header Card
    st.markdown(f"""
    <div class="plant-card" style="background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h2 style="margin: 0; color: #166534;">🌿 {info['plant_name']}</h2>
            <span style="font-style: italic; color: #4b5563; font-size: 1.05rem;">{info['scientific_name']}</span>
        </div>
        <p style="margin: 8px 0 0 0; color: #15803d; font-weight: 600;">Category: {info['category']}</p>
    </div>
    """, unsafe_allow_html=True)

    # Care Details Grid
    c1, c2 = st.columns(2)

    with c1:
        st.markdown(f"""
        <div class="plant-card">
            <h4>💧 Watering Requirement</h4>
            <p style="color: #374151; line-height: 1.6;">{info['watering']}</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown(f"""
        <div class="plant-card">
            <h4>🌱 Soil & Potting Mix</h4>
            <p style="color: #374151; line-height: 1.6;">{info['soil']}</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown(f"""
        <div class="plant-card">
            <h4>✂️ Pruning & Maintenance</h4>
            <p style="color: #374151; line-height: 1.6;">{info['pruning']}</p>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown(f"""
        <div class="plant-card">
            <h4>☀️ Sunlight Needs</h4>
            <p style="color: #374151; line-height: 1.6;">{info['sunlight']}</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown(f"""
        <div class="plant-card">
            <h4>🌡️ Ideal Temperature</h4>
            <p style="color: #374151; line-height: 1.6;">{info['temperature']}</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown(f"""
        <div class="plant-card">
            <h4>🧪 Fertilizer & Nutrition</h4>
            <p style="color: #374151; line-height: 1.6;">{info['fertilizer']}</p>
        </div>
        """, unsafe_allow_html=True)

    # Common Problems Box
    st.markdown(f"""
    <div class="plant-card" style="border-left: 6px solid #eab308;">
        <h4 style="color: #854d0e;">⚠️ Common Problems & Symptoms</h4>
        <p style="color: #374151; line-height: 1.6; margin: 0;">{info['common_problems']}</p>
    </div>
    """, unsafe_allow_html=True)


# =========================================================
# PAGE 4: 🤖 AI PLANT CHATBOT
# =========================================================
elif page_choice == "🤖 Ask PlantCare AI":
    st.title("🤖 Ask PlantCare AI")
    st.write("An intelligent chatbot assistant powered by Google Gemini to troubleshoot botanical questions.")

    current_p = st.session_state.current_plant
    st.info(f"🌿 Current Plant Focus: **{current_p}** (The AI tailors recommendations to this species)")

    # Suggested Prompts
    st.markdown("##### 💡 Suggested Questions (Click to Ask):")
    prompt_cols = st.columns(3)
    clicked_prompt = None

    with prompt_cols[0]:
        if st.button("💧 How often to water?", use_container_width=True):
            clicked_prompt = f"How often should I water my {current_p}?"
        if st.button("🍂 Why leaves turn yellow?", use_container_width=True):
            clicked_prompt = f"Why are the leaves on my {current_p} turning yellow?"

    with prompt_cols[1]:
        if st.button("☀️ Sunlight requirements?", use_container_width=True):
            clicked_prompt = f"How much sunlight does {current_p} need daily?"
        if st.button("🧪 What fertilizer to use?", use_container_width=True):
            clicked_prompt = f"What is the best fertilizer for {current_p}?"

    with prompt_cols[2]:
        if st.button("🍃 Why are leaves curling?", use_container_width=True):
            clicked_prompt = f"Why are leaves curling on my {current_p}?"
        if st.button("🐛 Natural pest remedies?", use_container_width=True):
            clicked_prompt = f"How can I naturally protect my {current_p} from pests?"

    # Display Chat History
    for msg in st.session_state.chat_messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # Chat Input handler (handles both text box and prompt buttons)
    user_input = st.chat_input("Ask any plant care question...")
    effective_prompt = clicked_prompt if clicked_prompt else user_input

    if effective_prompt:
        # Append User Message
        st.session_state.chat_messages.append({"role": "user", "content": effective_prompt})
        with st.chat_message("user"):
            st.markdown(effective_prompt)

        # Generate Assistant Response
        with st.chat_message("assistant"):
            with st.spinner("PlantCare AI is consulting botanical records..."):
                response_text = ask_gemini_plant_assistant(
                    user_query=effective_prompt,
                    plant_context=current_p
                )
                st.markdown(response_text)
                st.session_state.chat_messages.append({"role": "assistant", "content": response_text})

    # Clear chat option
    if len(st.session_state.chat_messages) > 1:
        if st.button("🧹 Clear Chat History", type="secondary"):
            st.session_state.chat_messages = [
                {
                    "role": "assistant",
                    "content": "👋 Chat reset. What would you like to know about your plants today?"
                }
            ]
            st.rerun()


# =========================================================
# PAGE 5: 📊 PLANT HEALTH DASHBOARD
# =========================================================
elif page_choice == "📊 Plant Health Dashboard":
    st.title("📊 Plant Health & Care Dashboard")
    st.write("Summary overview of plant vital indicators and weekly maintenance schedule.")

    curr_p = st.session_state.current_plant
    info = get_plant_info(curr_p)
    pred = st.session_state.prediction_result

    # Top Metrics Bar
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric(label="Selected Plant", value=info["plant_name"])
    with m2:
        conf_val = f"{pred['confidence']}%" if pred else "N/A"
        st.metric(label="Identification Confidence", value=conf_val)
    with m3:
        health_val = pred["health_status"] if pred else "Standard Good"
        st.metric(label="Health Condition", value=health_val)
    with m4:
        st.metric(label="Category", value=info["category"])

    st.markdown("---")

    # Detailed Care Parameters Table
    col_table, col_chart = st.columns([1, 1], gap="large")

    with col_table:
        st.markdown("### 📋 Core Care Specifications")
        care_df = pd.DataFrame([
            {"Parameter": "💧 Watering", "Recommendation": info["watering"][:80] + "..."},
            {"Parameter": "☀️ Sunlight", "Recommendation": info["sunlight"][:80] + "..."},
            {"Parameter": "🌱 Soil Type", "Recommendation": info["soil"][:80] + "..."},
            {"Parameter": "🌡️ Temperature", "Recommendation": info["temperature"]},
            {"Parameter": "🧪 Fertilizer", "Recommendation": info["fertilizer"][:80] + "..."}
        ])
        st.dataframe(care_df, use_container_width=True, hide_index=True)

        st.markdown(f"""
        <div class="plant-card" style="margin-top: 14px;">
            <h4>✂️ Pruning Routine</h4>
            <p style="margin: 0; color: #475569; font-size: 0.92rem;">{info['pruning']}</p>
        </div>
        """, unsafe_allow_html=True)

    with col_chart:
        st.markdown("### 📅 Weekly Plant Care Schedule")
        schedule_data = info.get("schedule", {})
        days = list(schedule_data.keys())
        tasks = list(schedule_data.values())

        # Render clean, colorful Matplotlib horizontal chart
        fig, ax = plt.subplots(figsize=(7, 4.5))
        y_pos = np.arange(len(days))

        # Nature color palette for different days
        colors = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#10b981', '#059669']

        bars = ax.barh(y_pos, [1] * len(days), color=colors, height=0.65, edgecolor='#dcfce7')

        # Add text labels inside bars
        for idx, (task, bar) in enumerate(zip(tasks, bars)):
            ax.text(
                0.05,
                bar.get_y() + bar.get_height() / 2,
                f"{days[idx]}: {task}",
                va='center',
                ha='left',
                color='#0f172a',
                fontsize=9.5,
                fontweight='semibold'
            )

        ax.set_yticks([])
        ax.set_xticks([])
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_visible(False)
        ax.spines['left'].set_visible(False)
        ax.set_title(f"7-Day Care Routine for {curr_p}", fontsize=11, color="#14532d", weight='bold', pad=12)
        fig.tight_layout()

        st.pyplot(fig)


# =========================================================
# PAGE 6: ℹ️ ABOUT PROJECT
# =========================================================
elif page_choice == "ℹ️ About Project":
    st.title("ℹ️ About AI PlantCare Assistant")

    st.markdown("""
    <div class="plant-card">
        <h3>🌱 Project Profile</h3>
        <p><strong>Project Name:</strong> AI PlantCare Assistant</p>
        <p><strong>Domain:</strong> Applied Machine Learning & Computer Vision (Computer Science and Botanical Health)</p>
        <p><strong>Objective:</strong> To provide an intuitive, accessible web platform that leverages Convolutional Neural Networks (CNN) and LLM-based Generative AI for plant identification, disease diagnosis, and botanical health guidance.</p>
    </div>
    """, unsafe_allow_html=True)

    col_tech, col_arch = st.columns(2, gap="large")

    with col_tech:
        st.markdown("### 🛠️ Technology Stack")
        st.markdown("""
        • **Python 3.11.9:** Core programming language.
        • **Streamlit (>=1.40,<2):** Interactive web application framework.
        • **TensorFlow (>=2.18,<3) & Keras (>=3.5,<4):** Deep learning framework for plant disease classification.
        • **PlantVillage Dataset:** Public agricultural image benchmark containing 54,306 images across 38 crop disease classes.
        • **OpenCV (>=4.10,<5) & Pillow (>=10,<13):** Image processing, color space conversion, and preprocessing.
        • **Google Gemini API (`google-genai`):** Natural language botanical assistant for the chatbot.
        • **Pandas & NumPy:** Tabular care database manipulation and numerical array operations.
        • **Matplotlib:** Visualization of care metrics and weekly schedules.
        """)

    with col_arch:
        st.markdown("### 🧠 How the AI Works")
        st.markdown("""
        1. **Image Input:** User uploads a leaf image via Streamlit file uploader.
        2. **Preprocessing:** Image is opened with Pillow, resized to `(224, 224, 3)`, and pixel values normalized to `[0.0, 1.0]`.
        3. **Feature Extraction:** A Deep Convolutional Neural Network (CNN) extracts spatial hierarchies of visual features (vein patterns, lesions, discoloration).
        4. **Softmax Output:** Model generates probability distribution across PlantVillage classes.
        5. **Care Mapping:** Diagnostic engine retrieves customized soil, water, and fertilizer parameters from `plant_data.csv`.
        6. **Generative Querying:** User asks questions via Gemini chatbot grounded in the identified plant context.
        """)

    st.markdown("---")
    st.markdown("### 💡 Technical Architecture & AI FAQs")
    with st.expander("Q1: Why is a CNN preferred over a Multi-Layer Perceptron (MLP) for leaf classification?"):
        st.write("A: CNNs have **spatial invariance** and use **weight sharing** through convolutional filters, making them significantly better at capturing local textures, edges, and leaf lesion geometries regardless of where they appear on the leaf, with far fewer parameters than dense MLPs.")

    with st.expander("Q2: What is the PlantVillage dataset?"):
        st.write("A: PlantVillage is an open-access repository of 54,306 plant leaf images categorized into 38 disease/healthy classes across 14 crop species (such as Tomato, Apple, Corn, Potato, Pepper, and Grape).")

    with st.expander("Q3: What happens if the trained model file is not available?"):
        st.write("A: The application implements a graceful fallback **Demo Mode**. It does not fake 99% accuracy; instead, it provides transparent simulated diagnostics so the demonstration and all other site features continue to run smoothly.")

    with st.expander("Q4: How is API security handled in this project?"):
        st.write("A: Sensitive credentials such as `GEMINI_API_KEY` are stored inside the `.env` file and read at runtime using `python-dotenv`. They are excluded from version control via `.gitignore` and never hardcoded.")
