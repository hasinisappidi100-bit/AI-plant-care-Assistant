# 🧠 Machine Learning Model Directory

This directory stores the trained deep learning model for the **AI PlantCare Assistant**.

### File Name:
`plant_model.keras`

---

## 📌 Dataset Overview: PlantVillage
- **Dataset:** PlantVillage Public Agricultural Benchmark
- **Total Images:** 54,306 high-resolution leaf images
- **Classes:** 38 classes (14 plant species, healthy & disease states)
- **Image Resolution:** 224x224 RGB
- **Classes included:**
  - Tomato: Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Mosaic Virus, Yellow Leaf Curl Virus, Healthy
  - Potato: Early Blight, Late Blight, Healthy
  - Bell Pepper: Bacterial Spot, Healthy
  - Apple: Apple Scab, Black Rot, Cedar Apple Rust, Healthy
  - Corn: Gray Leaf Spot, Common Rust, Healthy
  - Grape: Black Rot, Esca (Black Measles), Healthy
  - Strawberry: Leaf Scorch, Healthy
  - Peach: Bacterial Spot, Healthy

---

## ⚙️ Model Architecture & Training Specifications
- **Base Architecture:** Transfer learning with MobileNetV2 / ResNet50 or Custom 4-Layer Conv2D + MaxPooling2D + Dense Softmax.
- **Input Shape:** `(224, 224, 3)` normalized to `[0.0, 1.0]`.
- **Optimizer:** Adam (learning rate = 0.0001).
- **Loss Function:** `categorical_crossentropy`.
- **Metrics:** `accuracy` (typically reaches 94–98% on PlantVillage test split).

---

## 🚀 How to place your model file:
1. Train your model using TensorFlow/Keras or download your weights file.
2. Save or convert the model into Keras v3 format (`.keras`):
   ```python
   model.save("model/plant_model.keras")
   ```
3. Place `plant_model.keras` inside this `model/` folder.
4. When `plant_model.keras` is detected, `utils/image_processing.py` automatically loads it and provides live neural network inferences!
5. If absent, the app operates in **Safe Demo Mode** so your project presentation never crashes.
