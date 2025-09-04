# Wellness Backend API

Health risk assessment backend API that integrates Python machine learning models with Node.js service.

## Features

- 🔮 **Health Risk Assessment**: Vitamin D, eye health, and posture risk prediction
- 🧠 **Machine Learning Models**: Integrated LightGBM classifiers
- 🚀 **Node.js API**: Express.js RESTful API
- 🐍 **Python Bridge**: Call Python models via child_process
- 📊 **Comprehensive Scoring**: Weighted calculation of overall health risk

## Quick Start

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Copy Model Files

Copy all .pkl files from Wellness_Models directory to `backend/models/`:

```bash
# Copy model files
cp /path/to/Wellness_Models/*.pkl backend/models/
```

### 3. Start Service

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Health Risk Assessment
```
POST /api/wellness/predict
Content-Type: application/json

{
  "type": "Age",
  "value": "25–34",
  "dimension": "Persons",
  "metric": "Zero activity"
}
```

### Get Input Options
```
GET /api/wellness/options
```

## Response Format

```json
{
  "success": true,
  "data": {
    "vitamin_d_risk": 25.5,
    "eye_risk": 30.2,
    "posture_risk": 45.8,
    "overall_wellness_score": 32.1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deploy to AWS Lambda

1. Use `lambda_function.py` as Lambda entry point
2. Ensure all model files are included in deployment package
3. Set appropriate Lambda timeout and memory limits

## Tech Stack

- **Backend**: Node.js + Express.js
- **Machine Learning**: Python + LightGBM + scikit-learn
- **Deployment**: AWS Lambda
- **Bridge**: child_process

## Notes

- Ensure Python environment has required dependencies installed
- Model files must match encoders used during training
- Input data must conform to predefined categories