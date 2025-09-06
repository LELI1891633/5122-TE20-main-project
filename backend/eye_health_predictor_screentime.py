#!/usr/bin/env python3
"""
Eye Health Risk Prediction Script with Screen Time Support
Uses the new screen time model to provide more accurate predictions
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

def load_eye_models_with_screentime():
    """Load eye health models with screen time support"""
    models = {}
    try:
        # Load screen time model and encoders
        models['eye_screentime'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, 'eye_model_screentime.pkl')),
            'encoders': joblib.load(os.path.join(MODELS_DIR, 'eye_encoders_screentime.pkl'))
        }
        
        # Also load the original model for fallback
        models['eye_original'] = {
            'model': joblib.load(os.path.join(MODELS_DIR, 'eye_model_final.pkl')),
            'le_type': joblib.load(os.path.join(MODELS_DIR, 'le_type_eye_final.pkl')),
            'le_value': joblib.load(os.path.join(MODELS_DIR, 'le_value_eye_final.pkl')),
            'le_dim': joblib.load(os.path.join(MODELS_DIR, 'le_dim.pkl'))
        }
        
        return models
    except Exception as e:
        return {"error": f"Eye model loading failed: {str(e)}"}

def predict_eye_health_with_screentime(data, models):
    """
    Predict eye health risk using screen time model
    Expected input fields: ageGroup, sex, state, remotenessArea, screenTime
    """
    try:
        screen_time = data.get('screenTime', 8)
        print(f"🔍 Starting prediction with screen_time: {screen_time}", file=sys.stderr)
        
        # For now, always use original model with screen time adjustment
        # TODO: Fix screen time model later
        print(f"🔄 Using original model with screen time adjustment (screen time model disabled)", file=sys.stderr)
        return predict_with_original_model_and_screentime_adjustment(data, models['eye_original'])
        
        # Try to use screen time model first (disabled for debugging)
        # if 'eye_screentime' in models:
        #     try:
        #         screentime_result = predict_with_screentime_model(data, models['eye_screentime'])
        #         if screentime_result:
        #             return screentime_result
        #     except Exception as e:
        #         print(f"Screen time model failed, falling back to original: {e}", file=sys.stderr)
        
        # Fallback to original model with screen time adjustment
        # return predict_with_original_model_and_screentime_adjustment(data, models['eye_original'])
        
    except Exception as e:
        print(f"❌ Eye health prediction error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return {
            "eye_risk": 50.0,
            "risk_level": "Medium", 
            "confidence": "Low",
            "error": str(e)
        }

def predict_with_screentime_model(data, screentime_model):
    """Use the dedicated screen time model"""
    try:
        print(f"🔍 Screen time model prediction with data: {data}", file=sys.stderr)
        
        # Extract screen time and other features (removed state and remoteness)
        screen_time = data.get('screenTime', 8)
        age_group = data.get('ageGroup', '25–34')
        sex = data.get('sex', 'Male')
        
        print(f"📊 Extracted features - screen_time: {screen_time}, age_group: {age_group}, sex: {sex}", file=sys.stderr)
        
        # Check if model and encoders exist
        if not screentime_model or 'model' not in screentime_model or 'encoders' not in screentime_model:
            print("❌ Screen time model or encoders missing", file=sys.stderr)
            return None
        
        # Prepare features for the screen time model (only age, sex, and screen time)
        features = prepare_screentime_features(screen_time, age_group, sex, screentime_model['encoders'])
        print(f"🎯 Prepared features: {features}", file=sys.stderr)
        
        # Predict using the screen time model
        prob = screentime_model['model'].predict_proba([features])[:, 1][0]
        print(f"📈 Prediction probability: {prob}", file=sys.stderr)
        
        return {
            "eye_risk": round(prob * 100, 2),
            "risk_level": get_risk_level(prob),
            "confidence": get_confidence_score(prob),
            "model_used": "screen_time_model",
            "screen_time_impact": calculate_screen_time_impact(screen_time)
        }
        
    except Exception as e:
        print(f"❌ Screen time model prediction error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return None

def prepare_screentime_features(screen_time, age_group, sex, encoders):
    """Prepare features for the screen time model (only age, sex, and screen time)"""
    try:
        # Create a feature vector with only essential features
        features = []
        
        # Add screen time as a feature
        features.append(screen_time)
        
        # Try different encoder structures
        age_encoded = 0
        sex_encoded = 0
        
        # Check if encoders is a dictionary
        if isinstance(encoders, dict):
            if 'age_encoder' in encoders:
                age_encoded = encoders['age_encoder'].transform([age_group])[0]
            if 'sex_encoder' in encoders:
                sex_encoded = encoders['sex_encoder'].transform([sex])[0]
        # Check if encoders has attributes
        elif hasattr(encoders, 'age_encoder'):
            age_encoded = encoders.age_encoder.transform([age_group])[0]
        elif hasattr(encoders, 'sex_encoder'):
            sex_encoded = encoders.sex_encoder.transform([sex])[0]
        # Check if encoders is a list or tuple
        elif isinstance(encoders, (list, tuple)) and len(encoders) >= 2:
            try:
                age_encoded = encoders[0].transform([age_group])[0]
                sex_encoded = encoders[1].transform([sex])[0]
            except:
                pass
        
        features.extend([age_encoded, sex_encoded])
        
        print(f"Prepared features: {features}", file=sys.stderr)
        return features
        
    except Exception as e:
        print(f"Feature preparation error: {e}", file=sys.stderr)
        # Return a default feature vector (only 3 features now)
        return [screen_time, 0, 0]

def predict_with_original_model_and_screentime_adjustment(data, original_model):
    """Use original model with screen time adjustment"""
    try:
        print(f"🔄 Using original model with screen time adjustment", file=sys.stderr)
        
        # Use the original prediction method
        age_group = data.get('ageGroup', '25–34')
        sex = data.get('sex', 'Male')
        screen_time = data.get('screenTime', 8)

        print(f"📊 Original model features - age_group: {age_group}, sex: {sex}, screen_time: {screen_time}", file=sys.stderr)

        # Use age group as-is (same as original model)
        type_enc = original_model['le_type'].transform(['Age'])[0]
        value_enc = original_model['le_value'].transform([age_group])[0]
        dim_enc = original_model['le_dim'].transform(['Unnamed: 2'])[0]
        
        print(f"🎯 Encoded features - type: {type_enc}, value: {value_enc}, dim: {dim_enc}", file=sys.stderr)
        
        X_input = np.array([[type_enc, value_enc, dim_enc]])
        base_prob = original_model['model'].predict_proba(X_input)[:, 1][0]
        
        print(f"📈 Base probability: {base_prob}", file=sys.stderr)
        
        # Apply screen time adjustment
        adjusted_prob = apply_screen_time_adjustment(base_prob, screen_time)
        
        print(f"📊 Adjusted probability: {adjusted_prob}", file=sys.stderr)
        
        return {
            "eye_risk": round(adjusted_prob * 100, 2),
            "risk_level": get_risk_level(adjusted_prob),
            "confidence": get_confidence_score(adjusted_prob),
            "model_used": "original_with_screentime_adjustment",
            "screen_time_impact": calculate_screen_time_impact(screen_time),
            "base_risk": round(base_prob * 100, 2)
        }
        
    except Exception as e:
        print(f"❌ Original model with screen time adjustment error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return {
            "eye_risk": 50.0,
            "risk_level": "Medium",
            "confidence": "Low",
            "error": str(e)
        }

def apply_screen_time_adjustment(base_prob, screen_time):
    """Apply screen time adjustment to base probability"""
    # Screen time risk multipliers based on research
    if screen_time <= 2:
        multiplier = 0.8  # Lower risk for very low screen time
    elif screen_time <= 4:
        multiplier = 0.9  # Slightly lower risk
    elif screen_time <= 6:
        multiplier = 1.0  # Baseline risk
    elif screen_time <= 8:
        multiplier = 1.1  # Slightly higher risk
    elif screen_time <= 10:
        multiplier = 1.2  # Higher risk
    elif screen_time <= 12:
        multiplier = 1.3  # Significantly higher risk
    else:
        multiplier = 1.5  # Very high risk for excessive screen time
    
    adjusted_prob = base_prob * multiplier
    return min(0.95, adjusted_prob)  # Cap at 95%

def calculate_screen_time_impact(screen_time):
    """Calculate the impact of screen time on risk"""
    if screen_time <= 2:
        return "Very Low - Minimal screen time exposure"
    elif screen_time <= 4:
        return "Low - Limited screen time exposure"
    elif screen_time <= 6:
        return "Moderate - Average screen time exposure"
    elif screen_time <= 8:
        return "Elevated - Above average screen time exposure"
    elif screen_time <= 10:
        return "High - Significant screen time exposure"
    elif screen_time <= 12:
        return "Very High - Excessive screen time exposure"
    else:
        return "Critical - Extreme screen time exposure"

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

def generate_eye_health_recommendations_with_screentime(input_data, prediction_result):
    """Generate personalized recommendations including screen time advice"""
    recommendations = []
    risk_level = prediction_result.get("risk_level", "Medium")
    screen_time = input_data.get('screenTime', 8)
    
    # Screen time specific recommendations
    if screen_time > 10:
        recommendations.append("🚨 CRITICAL: Reduce daily screen time to under 8 hours immediately")
        recommendations.append("Take a 15-minute break every hour of screen use")
        recommendations.append("Consider using blue light filtering glasses or screen filters")
    elif screen_time > 8:
        recommendations.append("⚠️ HIGH: Your screen time is above recommended levels")
        recommendations.append("Implement the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds")
        recommendations.append("Take regular breaks and blink frequently")
    elif screen_time > 6:
        recommendations.append("✅ MODERATE: Your screen time is within acceptable range")
        recommendations.append("Continue practicing good eye habits")
    else:
        recommendations.append("✅ EXCELLENT: Your screen time is well within healthy limits")
        recommendations.append("Maintain your current healthy screen habits")
    
    # Age-based recommendations
    age_group = input_data.get('ageGroup', '')
    if '65+' in age_group or '75+' in age_group or '85+' in age_group:
        recommendations.append("Schedule annual comprehensive eye exams due to age-related risk factors")
    elif '45+' in age_group or '55+' in age_group:
        recommendations.append("Schedule biennial eye exams to monitor for presbyopia and early eye diseases")
    else:
        recommendations.append("Maintain regular eye check-ups every 2-3 years for preventive care")
    
    # Risk level based recommendations
    if risk_level == "High":
        recommendations.append("Consult with an ophthalmologist for comprehensive evaluation")
        recommendations.append("Implement strict eye protection measures in all environments")
    elif risk_level == "Medium":
        recommendations.append("Consider blue light filtering glasses for extended screen use")
        recommendations.append("Ensure adequate natural lighting in your workspace")
    else:
        recommendations.append("Maintain current healthy eye habits and continue preventive measures")
    
    # General recommendations
    recommendations.append("Maintain a balanced diet rich in eye-healthy nutrients (vitamins A, C, E, zinc, omega-3)")
    recommendations.append("Wear UV-protective sunglasses when outdoors")
    recommendations.append("Avoid smoking and limit alcohol consumption")
    
    return recommendations

def main():
    """Main function to run screen time prediction"""
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
                "screenTime": 8
            }
        
        models = load_eye_models_with_screentime()
        if "error" in models:
            print(json.dumps({"error": models["error"]}))
            return
        
        prediction_result = predict_eye_health_with_screentime(input_data, models)
        recommendations = generate_eye_health_recommendations_with_screentime(input_data, prediction_result)
        
        result = {
            **prediction_result,
            "recommendations": recommendations,
            "input_data": input_data
        }
        
        # Return results (only JSON to stdout)
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": f"Screen time eye health prediction failed: {str(e)}"}
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
