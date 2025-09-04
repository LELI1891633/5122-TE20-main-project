import React from 'react'
import RiskIndicator from './RiskIndicator'
import './AssessmentResult.css'

const AssessmentResult = ({ data, onBackToForm, onNewAssessment }) => {
  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'Low', color: '#4CAF50', icon: '✓' }
    if (score < 60) return { level: 'Medium', color: '#FF9800', icon: '⚠' }
    return { level: 'High', color: '#F44336', icon: '⚠' }
  }

  const getOverallRisk = getRiskLevel(data.overall_wellness_score)
  const vitaminDRisk = getRiskLevel(data.vitamin_d_risk)
  const eyeRisk = getRiskLevel(data.eye_risk)
  const postureRisk = getRiskLevel(data.posture_risk)

  const getRecommendations = () => {
    const recommendations = []
    
    if (data.vitamin_d_risk > 50) {
      recommendations.push({
        category: 'Vitamin D',
        suggestion: 'Consider spending more time outdoors or taking Vitamin D supplements',
        priority: 'high'
      })
    }
    
    if (data.eye_risk > 50) {
      recommendations.push({
        category: 'Eye Health',
        suggestion: 'Take regular breaks from screens and ensure proper lighting',
        priority: 'medium'
      })
    }
    
    if (data.posture_risk > 50) {
      recommendations.push({
        category: 'Posture',
        suggestion: 'Improve ergonomics and incorporate regular stretching exercises',
        priority: 'high'
      })
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        category: 'General',
        suggestion: 'Keep up the great work! Maintain your current healthy lifestyle',
        priority: 'low'
      })
    }
    
    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <div className="assessment-result">
      <div className="result-header">
        <h2>Your Wellness Assessment Results</h2>
        <div className="overall-score">
          <div className="score-circle">
            <div 
              className="score-fill" 
              style={{ 
                background: `conic-gradient(${getOverallRisk.color} ${data.overall_wellness_score * 3.6}deg, #e0e0e0 0deg)` 
              }}
            >
              <div className="score-inner">
                <span className="score-value">{data.overall_wellness_score}%</span>
                <span className="score-label">Overall Risk</span>
              </div>
            </div>
          </div>
          <div className="score-info">
            <h3>Overall Wellness Score</h3>
            <p className={`risk-level ${getOverallRisk.level.toLowerCase()}`}>
              {getOverallRisk.icon} {getOverallRisk.level} Risk
            </p>
          </div>
        </div>
      </div>

      <div className="risk-breakdown">
        <h3>Risk Breakdown</h3>
        <div className="risk-cards">
          <RiskIndicator
            title="Vitamin D Deficiency"
            score={data.vitamin_d_risk}
            riskLevel={vitaminDRisk}
            description="Risk of Vitamin D deficiency based on lifestyle factors"
          />
          
          <RiskIndicator
            title="Eye Health"
            score={data.eye_risk}
            riskLevel={eyeRisk}
            description="Risk of eye strain and vision problems"
          />
          
          <RiskIndicator
            title="Posture Issues"
            score={data.posture_risk}
            riskLevel={postureRisk}
            description="Risk of posture-related health problems"
          />
        </div>
      </div>

      <div className="recommendations">
        <h3>Personalized Recommendations</h3>
        <div className="recommendation-list">
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item ${rec.priority}`}>
              <div className="recommendation-header">
                <span className="category">{rec.category}</span>
                <span className="priority">{rec.priority}</span>
              </div>
              <p className="suggestion">{rec.suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button onClick={onBackToForm} className="btn-secondary">
          Back to Form
        </button>
        <button onClick={onNewAssessment} className="btn-primary">
          New Assessment
        </button>
      </div>
    </div>
  )
}

export default AssessmentResult

