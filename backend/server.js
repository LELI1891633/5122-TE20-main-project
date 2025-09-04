const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Wellness API is running',
    timestamp: new Date().toISOString()
  });
});

// Wellness risk assessment endpoint
app.post('/api/wellness/predict', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate input data
    if (!userData) {
      return res.status(400).json({ 
        error: 'Missing user data' 
      });
    }

    // Call Python script for prediction
    const result = await runPythonPrediction(userData);
    
    if (result.error) {
      return res.status(500).json({ 
        error: result.error 
      });
    }

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Eye health analysis endpoint
app.post('/api/eye-health/analyze', async (req, res) => {
  try {
    const eyeData = req.body;
    
    // Validate input data
    if (!eyeData) {
      return res.status(400).json({ 
        error: 'Missing eye health data' 
      });
    }

    // Call Python script for eye health prediction
    const result = await runEyeHealthPrediction(eyeData);
    
    if (result.error) {
      return res.status(500).json({ 
        error: result.error 
      });
    }

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Eye health analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Get available input options
app.get('/api/wellness/options', (req, res) => {
  res.json({
    age_groups: [
      '18–24', '25–34', '35–44', '45–54', '55–64', '65+'
    ],
    genders: [
      'Male', 'Female', 'Persons'
    ],
    states: [
      'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'
    ],
    activity_levels: [
      'Zero activity', 'Low activity', 'Moderate activity', 'High activity'
    ],
    health_conditions: [
      'Obese', 'Overweight', 'Normal weight', 'Underweight'
    ],
    guidelines: [
      'Meeting guidelines', 'Not meeting guidelines'
    ]
  });
});

// Run enhanced eye health prediction script
function runEyeHealthPrediction(eyeData) {
  return new Promise((resolve, reject) => {
    console.log('👁️ Starting enhanced eye health prediction with data:', JSON.stringify(eyeData, null, 2));

    const pythonScript = path.join(__dirname, 'eye_health_predictor_final.py');
    const inputFile = path.join(__dirname, 'temp_eye_input.json');
    console.log('🐍 Enhanced eye health script path:', pythonScript);
    console.log('📄 Input file path:', inputFile);
    
    // Write input data to temporary file
    const fs = require('fs');
    try {
      fs.writeFileSync(inputFile, JSON.stringify(eyeData, null, 2));
      console.log('✅ Eye health input data written to file');
    } catch (writeError) {
      console.error('❌ Failed to write eye health input file:', writeError);
      reject(new Error(`Failed to write input file: ${writeError.message}`));
      return;
    }
    
    const pythonProcess = spawn('py', [pythonScript, inputFile]);
    
    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      console.log('📤 Eye health stdout:', dataStr);
      output += dataStr;
    });

    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      console.log('⚠️ Eye health stderr:', dataStr);
      errorOutput += dataStr;
    });

    pythonProcess.on('close', (code) => {
      console.log(`🔚 Eye health process closed with code: ${code}`);
      console.log('📤 Final eye health output:', output);
      console.log('⚠️ Final eye health error output:', errorOutput);
      
      // Clean up temporary file
      try {
        fs.unlinkSync(inputFile);
        console.log('🗑️ Eye health temporary file cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Failed to clean up eye health temporary file:', cleanupError);
      }
      
      if (code !== 0) {
        console.error('❌ Eye health script execution failed:', errorOutput);
        reject(new Error(`Eye health script execution failed, exit code: ${code}. Error: ${errorOutput}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        console.log('✅ Successfully parsed eye health result:', result);
        resolve(result);
      } catch (parseError) {
        console.error('❌ Failed to parse eye health output:', output);
        console.error('❌ Parse error:', parseError);
        reject(new Error(`Failed to parse eye health result: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('❌ Failed to start eye health process:', error);
      reject(new Error(`Unable to start eye health prediction service: ${error.message}`));
    });
  });
}

// Run Python prediction script
function runPythonPrediction(userData) {
  return new Promise((resolve, reject) => {
    console.log('🔍 Starting Python prediction with data:', JSON.stringify(userData, null, 2));
    
    const pythonScript = path.join(__dirname, 'wellness_predictor.py');
    const inputFile = path.join(__dirname, 'temp_input.json');
    console.log('🐍 Python script path:', pythonScript);
    console.log('📄 Input file path:', inputFile);
    
    // Write input data to temporary file
    const fs = require('fs');
    try {
      fs.writeFileSync(inputFile, JSON.stringify(userData, null, 2));
      console.log('✅ Input data written to file');
    } catch (writeError) {
      console.error('❌ Failed to write input file:', writeError);
      reject(new Error(`Failed to write input file: ${writeError.message}`));
      return;
    }
    
    const pythonProcess = spawn('py', [pythonScript, inputFile]);
    
    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      console.log('📤 Python stdout:', dataStr);
      output += dataStr;
    });

    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      console.log('⚠️ Python stderr:', dataStr);
      errorOutput += dataStr;
    });

    pythonProcess.on('close', (code) => {
      console.log(`🔚 Python process closed with code: ${code}`);
      console.log('📤 Final output:', output);
      console.log('⚠️ Final error output:', errorOutput);
      
      // Clean up temporary file
      try {
        fs.unlinkSync(inputFile);
        console.log('🗑️ Temporary file cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Failed to clean up temporary file:', cleanupError);
      }
      
      if (code !== 0) {
        console.error('❌ Python script execution failed:', errorOutput);
        reject(new Error(`Python script execution failed, exit code: ${code}. Error: ${errorOutput}`));
        return;
      }

      try {
        const result = JSON.parse(output);
        console.log('✅ Successfully parsed Python result:', result);
        resolve(result);
      } catch (parseError) {
        console.error('❌ Failed to parse Python output:', output);
        console.error('❌ Parse error:', parseError);
        reject(new Error(`Failed to parse prediction result: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('❌ Failed to start Python process:', error);
      reject(new Error(`Unable to start prediction service: ${error.message}`));
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Wellness API server running on port ${PORT}`);
  console.log(`📊 Health check: http://127.0.0.1:${PORT}/api/health`);
  console.log(`🔮 Prediction endpoint: http://127.0.0.1:${PORT}/api/wellness/predict`);
  console.log(`📋 Options endpoint: http://127.0.0.1:${PORT}/api/wellness/options`);
});

module.exports = app;
