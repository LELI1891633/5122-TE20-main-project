#!/usr/bin/env python3
"""
Eye Health Risk Prediction Script
Dedicated script for eye health analysis using the eye health model
"""
import sys
import json
import joblib
import numpy as np
import os
import warnings

# Suppress sklearn warnings
warnings.filterwarnings('ignore')

# Get model file paths
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def load_eye_models():
    """Load eye health models and encoders"""
    try:
        models = {
            'eye': {
                'model': joblib.load(os.path.join(MODELS_DIR, 'eye_model_final.pkl')),
                'le_type': joblib.load(os.path.join(MODELS_DIR, 'le_type_eye_final.pkl')),
                'le_value': joblib.load(os.path.join(MODELS_DIR, 'le_value_eye_final.pkl')),
                'le_dim': joblib.load(os.path.join(MODELS_DIR, 'le_dim.pkl'))
            }
        }
        return models
    except Exception as e:
        return {"error": f"Eye model loading failed: {str(e)}"}

def predict_eye_health_risk(data, models):
    """
    Predict eye health risk based on user input
    Expected input fields: ageGroup, sex, state, remotenessArea
    """
    try:
        # Map user input to model requirements
        # The eye model expects: type (Age) + value (25–34) + dimension (Unnamed: 2, etc.)
        
        # Use Age as the type (this is valid in le_type classes)
        type_enc = models['eye']['le_type'].transform(['Age'])[0]
        
        # Use age group as the value (25–34 is valid in le_value classes)
        age_group = data.get('ageGroup', '25–34')
        value_enc = models['eye']['le_value'].transform([age_group])[0]
        
        # Use dimension (le_dim classes: ['Unnamed: 10' 'Unnamed: 11' 'Unnamed: 2' 'Unnamed: 3' ...])
        # Use 'Unnamed: 2' as default dimension
        dim_enc = models['eye']['le_dim'].transform(['Unnamed: 2'])[0]
        
        # Create input array
        X_input = np.array([[type_enc, value_enc, dim_enc]])
        
        # Predict probability
        prob = models['eye']['model'].predict_proba(X_input)[:, 1][0]
        
        return {
            "eye_risk": round(prob * 100, 2),
            "risk_level": get_risk_level(prob),
            "confidence": get_confidence_score(prob)
        }
        
    except Exception as e:
        print(f"Eye health prediction error: {e}")
        return {
            "eye_risk": 50.0,  # Default medium risk
            "risk_level": "Medium",
            "confidence": "Low",
            "error": str(e)
        }

def get_risk_level(probability):
    """Determine risk level based on probability"""
    if probability < 0.3:
        return "Low"
    elif probability < 0.7:
        return "Medium"
    else:
        return "High"

def get_confidence_score(probability):
    """Determine confidence level based on probability"""
    # Higher confidence when probability is closer to 0 or 1
    distance_from_center = abs(probability - 0.5)
    if distance_from_center > 0.4:
        return "High"
    elif distance_from_center > 0.2:
        return "Medium"
    else:
        return "Low"

def generate_eye_health_recommendations(data, result):
    """Generate personalized recommendations based on analysis"""
    recommendations = []
    risk_level = result.get("risk_level", "Medium")
    age_group = data.get('ageGroup', '25–34')
    sex = data.get('sex', 'Persons')
    state = data.get('state', '')
    remoteness = data.get('remotenessArea', '')
    
    # Age-based recommendations
    if '65+' in age_group or '75+' in age_group:
        recommendations.append("Schedule annual comprehensive eye exams due to age-related risk factors")
        recommendations.append("Consider age-related macular degeneration screening")
    elif '45' in age_group or '55' in age_group:
        recommendations.append("Schedule bi-annual eye exams for early detection of age-related conditions")
        recommendations.append("Monitor for presbyopia and other age-related vision changes")
    else:
        recommendations.append("Schedule annual eye exams for preventive care")
    
    # Risk level based recommendations
    if risk_level == "High":
        recommendations.append("Consult with an ophthalmologist for comprehensive evaluation")
        recommendations.append("Implement strict 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds")
        recommendations.append("Consider blue light filtering glasses for screen use")
        recommendations.append("Monitor for symptoms of digital eye strain")
    elif risk_level == "Medium":
        recommendations.append("Follow the 20-20-20 rule during screen work")
        recommendations.append("Ensure proper lighting in your workspace")
        recommendations.append("Take regular breaks from screen activities")
    else:
        recommendations.append("Maintain current eye health practices")
        recommendations.append("Continue regular eye exams as recommended")
    
    # Location-based recommendations
    if remoteness and 'Remote' in remoteness:
        recommendations.append("Consider telemedicine options for eye health consultations")
        recommendations.append("Plan regular visits to urban areas for comprehensive eye exams")
    
    # General recommendations
    recommendations.extend([
        "Maintain a balanced diet rich in eye-healthy nutrients (vitamins A, C, E, zinc, omega-3)",
        "Wear UV-protective sunglasses when outdoors",
        "Avoid smoking and limit alcohol consumption",
        "Manage chronic conditions like diabetes and hypertension that can affect eye health"
    ])
    
    return recommendations

def main():
    """Main function for eye health prediction"""
    try:
        # Read input data
        if len(sys.argv) < 2:
            input_data = {}
        else:
            input_source = sys.argv[1]
            print(f"Reading input from: {input_source}", file=sys.stderr)
            
            if os.path.isfile(input_source):
                try:
                    with open(input_source, 'r', encoding='utf-8') as f:
                        input_data = json.load(f)
                    print(f"Successfully loaded data from file: {input_data}", file=sys.stderr)
                except (json.JSONDecodeError, IOError) as e:
                    print(f"File read error: {e}", file=sys.stderr)
                    input_data = {}
            else:
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
                    "sex": "Persons",
                    "state": "VIC",
                    "remotenessArea": "Major Cities"
                }
        
        # Load models
        models = load_eye_models()
        if "error" in models:
            print(json.dumps({"error": models["error"]}))
            return
        
        # Predict eye health risk
        result = predict_eye_health_risk(input_data, models)
        
        # Generate recommendations
        recommendations = generate_eye_health_recommendations(input_data, result)
        result["recommendations"] = recommendations
        
        # Add input data for reference
        result["input_data"] = input_data
        
        # Return results (only JSON to stdout)
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": f"Eye health prediction failed: {str(e)}"}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
