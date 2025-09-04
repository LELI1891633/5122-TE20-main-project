# Deployment Notes — Wellness Risk Models

This document provides technical notes for deploying the **Iteration 1 wellness risk models**.

---

## Requirements

The following Python packages are required:

- lightgbm
- scikit-learn
- numpy
- joblib

You can install them with:

```bash
pip install lightgbm scikit-learn numpy joblib
```

---

## Loading Models and Encoders

Example for Vitamin D:

```python
import joblib
import numpy as np

# Load model + encoders
vitd_model = joblib.load("vitd_model.pkl")
le_type_vitd = joblib.load("le_type_vitd.pkl")
le_value_vitd = joblib.load("le_value_vitd.pkl")

# Encode input: Age=25–34
type_enc = le_type_vitd.transform(["Age"])[0]
value_enc = le_value_vitd.transform(["25–34"])[0]

X_input = np.array([[type_enc, value_enc]])

# Predict
prob = vitd_model.predict_proba(X_input)[:, 1][0]
print("Predicted Vitamin D Deficiency Risk:", round(prob*100, 2), "%")
```

---

## Integration Notes

1. **API Layer**  
   - Wrap the models in an API endpoint (e.g., `/predict_wellness`).  
   - Accept user inputs (e.g., age group, sex, state).  
   - Use the encoders to transform categorical input into numeric arrays.  
   - Run prediction with the correct model.  

2. **Wellness Score Computation**  
   - Collect probabilities from Eye, Posture, and Vitamin D models.  
   - Compute final score with the formula:  

   ```
   Score = 0.4 * P(Eye High) + 0.3 * P(Posture High) + 0.3 * P(VitD High)
   ```

3. **Encoders**  
   - Always load the correct encoders for each head.  
   - Inputs must match training categories.  
     If the system sees an unseen category → raise error or fallback.  

4. **Scaling & Iterations**  
   - Current models are **Iteration 1 baseline**.  
   - Iteration 2 should consider:  
     - Hyperparameter tuning  
     - More datasets  
     - Balancing class distributions  

---

## Deliverables

- 3 trained models (`vitd_model.pkl`, `eye_model.pkl`, `posture_model.pkl`)  
- 8 encoders (2 for VitD, 3 for Eye, 3 for Posture)  
- README.md + deployment_notes.md  
