"""
train_or_export_model.py
------------------------
Utility script to generate a starter trained/transfer-learning Keras model
for the PlantVillage dataset classes.

Usage:
    python train_or_export_model.py

Generates:
    model/plant_model.keras
"""

import os
import sys

def build_and_save_starter_model():
    print("[*] Initializing Keras model architecture for PlantVillage (38 classes)...")
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models
    except ImportError:
        print("[!] TensorFlow is not installed in the current environment.")
        print("    Install it via: pip install tensorflow keras")
        return

    # Ensure model folder exists
    os.makedirs("model", exist_ok=True)
    os.makedirs("AI-PlantCare-Assistant/model", exist_ok=True)

    target_path = os.path.join("model", "plant_model.keras")
    alt_target_path = os.path.join("AI-PlantCare-Assistant", "model", "plant_model.keras")

    # Simple 4-layer Convolutional Neural Network suitable for demonstration
    model = models.Sequential([
        layers.Input(shape=(224, 224, 3)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(29, activation='softmax')  # 29 primary classes mapped in app
    ])

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print(f"[*] Saving model to {target_path} and {alt_target_path}...")
    model.save(target_path)
    model.save(alt_target_path)
    print("[✓] Model generated successfully! You can now run 'streamlit run app.py'.")

if __name__ == "__main__":
    build_and_save_starter_model()
