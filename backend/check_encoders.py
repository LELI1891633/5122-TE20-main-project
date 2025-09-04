#!/usr/bin/env python3
import joblib
import os

# Get model file paths
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def check_encoders():
    """Check all encoder classes"""
    print("🔍 Checking encoder classes...")
    
    try:
        # Vitamin D encoders
        print("\n📊 Vitamin D Encoders:")
        le_type_vitd = joblib.load(os.path.join(MODELS_DIR, 'le_type_vitd_final.pkl'))
        le_value_vitd = joblib.load(os.path.join(MODELS_DIR, 'le_value_vitd_final.pkl'))
        
        print(f"  le_type classes: {le_type_vitd.classes_}")
        print(f"  le_value classes: {le_value_vitd.classes_}")
        
        # Eye health encoders
        print("\n👁️ Eye Health Encoders:")
        le_type_eye = joblib.load(os.path.join(MODELS_DIR, 'le_type_eye_final.pkl'))
        le_value_eye = joblib.load(os.path.join(MODELS_DIR, 'le_value_eye_final.pkl'))
        le_dim_eye = joblib.load(os.path.join(MODELS_DIR, 'le_dim.pkl'))
        
        print(f"  le_type classes: {le_type_eye.classes_}")
        print(f"  le_value classes: {le_value_eye.classes_}")
        print(f"  le_dim classes: {le_dim_eye.classes_}")
        
        # Posture encoders
        print("\n🦴 Posture Encoders:")
        le_type_posture = joblib.load(os.path.join(MODELS_DIR, 'le_type_posture_final.pkl'))
        le_value_posture = joblib.load(os.path.join(MODELS_DIR, 'le_value_posture_final.pkl'))
        
        print(f"  le_type classes: {le_type_posture.classes_}")
        print(f"  le_value classes: {le_value_posture.classes_}")
        
    except Exception as e:
        print(f"❌ Error loading encoders: {e}")

if __name__ == "__main__":
    check_encoders()

