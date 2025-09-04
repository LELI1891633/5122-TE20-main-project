# Wellness Risk Models (Iteration 1)

This package contains three trained LightGBM classifiers for wellness risk prediction:
- **Vitamin D Deficiency Risk** (`vitd_model.pkl`)
- **Eye Health Risk** (`eye_model.pkl`)
- **Posture Risk** (`posture_model.pkl`)

Each model uses LabelEncoders (`.pkl`) to convert categorical features into numeric codes.

---

## Encoders

- **Vitamin D**
  - `le_type_vitd.pkl` (e.g., subgroup_type: Age, Sex, State)
  - `le_value_vitd.pkl` (e.g., subgroup_value: 25–34, Male, VIC)

- **Eye Health**
  - `le_type_eye.pkl`
  - `le_value_eye.pkl`
  - `le_dim.pkl` (e.g., Male/Female/Persons)

- **Posture**
  - `le_type_posture.pkl`
  - `le_value_posture.pkl`
  - `le_metric.pkl` (e.g., Zero activity, Obese, Not meeting guidelines)

---

## Usage Example (Python)

```python
import joblib
import numpy as np

# ---------------------------
# Load Eye Health model + encoders
# ---------------------------
eye_model = joblib.load("eye_model.pkl")
le_type_eye = joblib.load("le_type_eye.pkl")
le_value_eye = joblib.load("le_value_eye.pkl")
le_dim = joblib.load("le_dim.pkl")

# Example user input: Age=25–34, Sex=Male, Dimension=Persons
type_enc = le_type_eye.transform(["Age"])[0]
value_enc = le_value_eye.transform(["25–34"])[0]
dim_enc = le_dim.transform(["Persons"])[0]

X_input = np.array([[type_enc, value_enc, dim_enc]])

# Predict probability of high risk
prob = eye_model.predict_proba(X_input)[:, 1][0]
print("Predicted Eye Health Risk:", round(prob*100, 2), "%")
```

---

## Wellness Score Formula

The three model outputs are combined into an **Overall Wellness Risk Score**:

```
Score = 0.4 * P(Eye High) + 0.3 * P(Posture High) + 0.3 * P(VitD High)
```

Where:
- `P(Head High)` = predicted probability from each classifier.
- Weights (`0.4, 0.3, 0.3`) can be tuned later.

Individual risk scores = `P(Head High) × 100`.

---

## Deployment Notes

- These `.pkl` models can be loaded directly into a backend API (FastAPI, Flask, Django, etc.).
- Inputs must be encoded using the provided encoders.
- Each model is independent, meaning Eye, Posture, and Vitamin D are predicted separately and then combined.
- Models are **population-level**, trained for Iteration 1 (baseline).  
  They can be retrained with additional datasets in later iterations for improved accuracy.
- Encoders **must match exactly** the categories they were trained on.  
  (If new categories appear in future data, retraining will be required.)
