#!/usr/bin/env python3
"""
Final Eye Health Risk Prediction Script
Uses age-based analysis with demographic adjustments
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
    """Load eye health model and encoders"""
    models = {}
    try:
        models['eye'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, 'eye_model_final.pkl')),
            'le_type': joblib.load(os.path.join(MODELS_DIR, 'le_type_eye_final.pkl')),
            'le_value': joblib.load(os.path.join(MODELS_DIR, 'le_value_eye_final.pkl')),
            'le_dim': joblib.load(os.path.join(MODELS_DIR, 'le_dim.pkl'))
        }
        return models
    except Exception as e:
        return {"error": f"Eye model loading failed: {str(e)}"}

def predict_eye_health_risk_final(data, models):
    """
    Final prediction using age-based analysis with demographic adjustments
    """
    try:
        # Primary analysis based on age (most reliable)
        age_group = data.get('ageGroup', '25–34')
        base_risk = predict_age_based_risk(age_group, models)
        
        # Apply demographic adjustments
        adjusted_risk = apply_demographic_adjustments(base_risk, data)
        
        return {
            "eye_risk": round(adjusted_risk, 2),
            "risk_level": get_risk_level(adjusted_risk / 100),
            "confidence": get_confidence_score(adjusted_risk / 100),
            "base_age_risk": base_risk,
            "demographic_adjustments": get_demographic_adjustments(data)
        }

    except Exception as e:
        print(f"Final prediction error: {e}", file=sys.stderr)
        return {
            "eye_risk": 50.0,
            "risk_level": "Medium",
            "confidence": "Low",
            "error": str(e)
        }

def predict_age_based_risk(age_group, models):
    """Predict risk based on age group (most reliable method)"""
    try:
        # Use Age as type
        type_enc = models['eye']['le_type'].transform(['Age'])[0]
        
        # Use age group as value
        value_enc = models['eye']['le_value'].transform([age_group])[0]
        
        # Use default dimension
        dim_enc = models['eye']['le_dim'].transform(['Unnamed: 2'])[0]
        
        # Create input array
        X_input = np.array([[type_enc, value_enc, dim_enc]])
        
        # Predict probability
        prob = models['eye']['model'].predict_proba(X_input)[:, 1][0]
        
        return prob * 100
        
    except Exception as e:
        print(f"Age-based prediction error: {e}", file=sys.stderr)
        return 50.0

def apply_demographic_adjustments(base_risk, data):
    """Apply demographic adjustments to base risk"""
    adjusted_risk = base_risk
    
    # Sex-based adjustments (based on general health statistics)
    sex = data.get('sex', '')
    if sex == 'Male':
        adjusted_risk *= 1.05  # Slightly higher risk for males
    elif sex == 'Female':
        adjusted_risk *= 0.98  # Slightly lower risk for females
    
    # State-based adjustments (based on healthcare access and demographics)
    state = data.get('state', '')
    state_adjustments = {
        'NSW': 1.02,  # Slightly higher due to urban stress
        'VIC': 1.00,  # Baseline
        'QLD': 0.98,  # Slightly lower due to lifestyle
        'SA': 1.01,   # Slightly higher
        'WA': 0.99,   # Slightly lower
        'TAS': 1.03,  # Higher due to aging population
        'NT': 1.05,   # Higher due to remote healthcare access
        'ACT': 0.97   # Lower due to high education/income
    }
    adjusted_risk *= state_adjustments.get(state, 1.00)
    
    # Remoteness-based adjustments
    remoteness = data.get('remotenessArea', '')
    remoteness_adjustments = {
        'Major Cities': 1.01,      # Slightly higher due to pollution/stress
        'Inner Regional': 1.00,    # Baseline
        'Outer Regional': 1.02,    # Slightly higher due to limited access
        'Remote': 1.05,            # Higher due to limited healthcare
        'Very Remote': 1.08        # Highest due to very limited access
    }
    adjusted_risk *= remoteness_adjustments.get(remoteness, 1.00)
    
    # Ensure risk stays within reasonable bounds (10-95%)
    adjusted_risk = max(10.0, min(95.0, adjusted_risk))
    
    return adjusted_risk

def get_demographic_adjustments(data):
    """Get information about applied demographic adjustments"""
    adjustments = {}
    
    sex = data.get('sex', '')
    if sex:
        adjustments['sex'] = {
            'value': sex,
            'adjustment': '1.05x' if sex == 'Male' else '0.98x' if sex == 'Female' else '1.00x'
        }
    
    state = data.get('state', '')
    if state:
        state_adjustments = {
            'NSW': '1.02x', 'VIC': '1.00x', 'QLD': '0.98x', 'SA': '1.01x',
            'WA': '0.99x', 'TAS': '1.03x', 'NT': '1.05x', 'ACT': '0.97x'
        }
        adjustments['state'] = {
            'value': state,
            'adjustment': state_adjustments.get(state, '1.00x')
        }
    
    remoteness = data.get('remotenessArea', '')
    if remoteness:
        remoteness_adjustments = {
            'Major Cities': '1.01x', 'Inner Regional': '1.00x', 'Outer Regional': '1.02x',
            'Remote': '1.05x', 'Very Remote': '1.08x'
        }
        adjustments['remoteness'] = {
            'value': remoteness,
            'adjustment': remoteness_adjustments.get(remoteness, '1.00x')
        }
    
    return adjustments

def get_risk_level(probability):
    """Determine risk level based on probability"""
    if probability < 0.3:
        return "Low"
    elif probability < 0.7:
        return "Medium"
    else:
        return "High"

def get_confidence_score(probability):
    """Determine confidence score based on probability"""
    if probability < 0.2 or probability > 0.8:
        return "High"
    elif probability < 0.4 or probability > 0.6:
        return "Medium"
    else:
        return "Low"

def generate_eye_health_recommendations(input_data, prediction_result):
    """Generate personalized eye health recommendations"""
    recommendations = []
    risk_level = prediction_result.get("risk_level", "Medium")
    
    # Age-based recommendations
    age_group = input_data.get('ageGroup', '')
    if '65+' in age_group or '75+' in age_group or '85+' in age_group:
        recommendations.append("Schedule annual comprehensive eye exams due to age-related risk factors")
        recommendations.append("Monitor for age-related macular degeneration and cataracts")
    elif '45+' in age_group or '55+' in age_group:
        recommendations.append("Schedule biennial eye exams to monitor for presbyopia and early eye diseases")
    else:
        recommendations.append("Maintain regular eye check-ups every 2-3 years for preventive care")
    
    # Risk level based recommendations
    if risk_level == "High":
        recommendations.append("Consult with an ophthalmologist for comprehensive evaluation")
        recommendations.append("Implement strict eye protection measures in all environments")
    elif risk_level == "Medium":
        recommendations.append("Implement the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds")
        recommendations.append("Consider blue light filtering glasses for extended screen use")
    else:
        recommendations.append("Maintain current healthy eye habits and continue preventive measures")
    
    # Location-based recommendations
    remoteness = input_data.get('remotenessArea', '')
    if remoteness in ['Remote', 'Very Remote']:
        recommendations.append("Plan ahead for eye care appointments due to limited local access")
        recommendations.append("Consider telehealth options for initial consultations")
    
    # General recommendations
    recommendations.append("Maintain a balanced diet rich in eye-healthy nutrients (vitamins A, C, E, zinc, omega-3)")
    recommendations.append("Wear UV-protective sunglasses when outdoors")
    recommendations.append("Avoid smoking and limit alcohol consumption")
    recommendations.append("Manage chronic conditions like diabetes and hypertension that can affect eye health")
    
    return recommendations

def main():
    """Main function to run final prediction"""
    try:
        # Read input data
        if len(sys.argv) < 2:
            input_data = {}
        else:
            input_source = sys.argv[1]
            if os.path.isfile(input_source):
                with open(input_source, 'r', encoding='utf-8') as f:
                    input_data = json.load(f)
            else:
                try:
                    input_data = json.loads(input_source)
                except json.JSONDecodeError:
                    input_data = {}
        
        if not input_data:
            input_data = {
                "ageGroup": "25–34",
                "sex": "Male",
                "state": "VIC",
                "remotenessArea": "Major Cities"
            }
        
        models = load_eye_models()
        if "error" in models:
            print(json.dumps({"error": models["error"]}))
            return
        
        prediction_result = predict_eye_health_risk_final(input_data, models)
        recommendations = generate_eye_health_recommendations(input_data, prediction_result)
        
        result = {
            **prediction_result,
            "recommendations": recommendations,
            "input_data": input_data
        }
        
        # Return results (only JSON to stdout)
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": f"Final eye health prediction failed: {str(e)}"}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
