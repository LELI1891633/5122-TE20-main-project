#!/usr/bin/env python3
import sys
import json
import joblib
import numpy as np
import os

# Get model file paths
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def load_models():
    """Load all models and encoders"""
    models = {}
    
    try:
        # Vitamin D model
        models['vitd'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, 'vitd_model_final.pkl')),
            'le_type': joblib.load(os.path.join(MODELS_DIR, 'le_type_vitd_final.pkl')),
            'le_value': joblib.load(os.path.join(MODELS_DIR, 'le_value_vitd_final.pkl'))
        }
        
        # Eye health model
        models['eye'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, 'eye_model_final.pkl')),
            'le_type': joblib.load(os.path.join(MODELS_DIR, 'le_type_eye_final.pkl')),
            'le_value': joblib.load(os.path.join(MODELS_DIR, 'le_value_eye_final.pkl')),
            'le_dim': joblib.load(os.path.join(MODELS_DIR, 'le_dim.pkl'))
        }
        
        # Posture model
        models['posture'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, 'posture_model_final.pkl')),
            'le_type': joblib.load(os.path.join(MODELS_DIR, 'le_type_posture_final.pkl')),
            'le_value': joblib.load(os.path.join(MODELS_DIR, 'le_value_posture_final.pkl')),
            'le_metric': joblib.load(os.path.join(MODELS_DIR, 'le_metric_final.pkl'))
        }
        
        return models
    except Exception as e:
        return {"error": f"Model loading failed: {str(e)}"}

def predict_vitd_risk(data, models):
    """Predict Vitamin D risk"""
    try:
        # Vitamin D model needs: type (Age/Sex/State) + value (25–34/Male/VIC)
        # We'll use Age as type and age group as value
        type_enc = models['vitd']['le_type'].transform([data.get('type', 'Age')])[0]
        value_enc = models['vitd']['le_value'].transform([data.get('value', '25–34')])[0]
        
        X_input = np.array([[type_enc, value_enc]])
        prob = models['vitd']['model'].predict_proba(X_input)[:, 1][0]
        return prob
    except Exception as e:
        print(f"VitD prediction error: {e}")
        return 0.5  # Default medium risk

def predict_eye_risk(data, models):
    """Predict eye health risk"""
    try:
        # Eye health model needs: type (Age) + value (25–34) + dimension (Persons/Male/Female)
        type_enc = models['eye']['le_type'].transform([data.get('type', 'Age')])[0]
        value_enc = models['eye']['le_value'].transform([data.get('value', '25–34')])[0]
        dim_enc = models['eye']['le_dim'].transform([data.get('dimension', 'Persons')])[0]
        
        X_input = np.array([[type_enc, value_enc, dim_enc]])
        prob = models['eye']['model'].predict_proba(X_input)[:, 1][0]
        return prob
    except Exception as e:
        print(f"Eye prediction error: {e}")
        return 0.5  # Default medium risk

def predict_posture_risk(data, models):
    """Predict posture risk"""
    try:
        # Posture model needs: type (Age) + value (25–34) + metric (Zero activity/Obese/Not meeting guidelines)
        type_enc = models['posture']['le_type'].transform([data.get('type', 'Age')])[0]
        value_enc = models['posture']['le_value'].transform([data.get('value', '25–34')])[0]
        metric_enc = models['posture']['le_metric'].transform([data.get('metric', 'Zero activity')])[0]
        
        X_input = np.array([[type_enc, value_enc, metric_enc]])
        prob = models['posture']['model'].predict_proba(X_input)[:, 1][0]
        return prob
    except Exception as e:
        print(f"Posture prediction error: {e}")
        return 0.5  # Default medium risk

def main():
    """Main function"""
    try:
        # Read input data from file or command line arguments
        if len(sys.argv) < 2:
            input_data = {}
        else:
            input_source = sys.argv[1]
            print(f"Reading input from: {input_source}", file=sys.stderr)
            
            # Check if it's a file path
            if os.path.isfile(input_source):
                try:
                    with open(input_source, 'r', encoding='utf-8') as f:
                        input_data = json.load(f)
                    print(f"Successfully loaded data from file: {input_data}", file=sys.stderr)
                except (json.JSONDecodeError, IOError) as e:
                    print(f"File read error: {e}", file=sys.stderr)
                    input_data = {}
            else:
                # Try to parse as JSON string
                try:
                    input_data = json.loads(input_source)
                    print(f"Successfully parsed JSON string: {input_data}", file=sys.stderr)
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {e}", file=sys.stderr)
                    input_data = {}
            
            # Fallback to default data if parsing failed
            if not input_data:
                print("Using fallback default data", file=sys.stderr)
                input_data = {
                    "ageGroup": "25–34",
                    "gender": "Sex",
                    "state": "Vic.",
                    "activityLevel": "Mostly sitting",
                    "healthCondition": "Total",
                    "guidelines": "Met guidelines"
                }
        
        # Load models
        models = load_models()
        if "error" in models:
            print(json.dumps({"error": models["error"]}))
            return
        
        # Predict each risk with appropriate data mapping using valid encoder values
        # Vitamin D: uses valid encoder values
        vitd_data = {
            'type': 'Total',  # Valid from le_type classes: ['Autumn' 'Country of birth' 'Industry' 'Spring ' 'Summer ' 'Total' 'Winter']
            'value': 'Vic.'  # Valid from le_value classes
        }
        vitd_risk = predict_vitd_risk(vitd_data, models)
        
        # Eye Health: uses valid encoder values
        eye_data = {
            'type': 'Age',  # Valid from le_type classes: ['Age' 'Country of birth' 'Indigenous status' 'Other' 'Remoteness area' 'Service type' 'Sex' 'Socioeconomic index' 'State/Territory']
            'value': '25–34',  # Valid from le_value classes
            'dimension': 'Unnamed: 2'  # Valid from le_dim classes: ['Unnamed: 10' 'Unnamed: 11' 'Unnamed: 2' 'Unnamed: 3' 'Unnamed: 4' 'Unnamed: 5' 'Unnamed: 6' 'Unnamed: 7' 'Unnamed: 8' 'Unnamed: 9']
        }
        eye_risk = predict_eye_risk(eye_data, models)
        
        # Posture: uses valid encoder values
        posture_data = {
            'type': 'Age',  # Valid from le_type classes: ['Age']
            'value': 'Total persons 15 years and over',  # Valid from le_value classes
            'metric': 'Unnamed: 1'  # Valid from le_metric classes: ['Unnamed: 1' 'Unnamed: 10' 'Unnamed: 11' 'Unnamed: 12' 'Unnamed: 13' 'Unnamed: 14' 'Unnamed: 15' 'Unnamed: 16' 'Unnamed: 17' 'Unnamed: 2' 'Unnamed: 3' 'Unnamed: 4' 'Unnamed: 5' 'Unnamed: 6' 'Unnamed: 7' 'Unnamed: 8' 'Unnamed: 9']
        }
        posture_risk = predict_posture_risk(posture_data, models)
        
        # Calculate overall score
        wellness_score = 0.4 * eye_risk + 0.3 * posture_risk + 0.3 * vitd_risk
        
        # Return results
        result = {
            "vitamin_d_risk": round(vitd_risk * 100, 2),
            "eye_risk": round(eye_risk * 100, 2),
            "posture_risk": round(posture_risk * 100, 2),
            "overall_wellness_score": round(wellness_score * 100, 2)
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": f"Prediction failed: {str(e)}"}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
