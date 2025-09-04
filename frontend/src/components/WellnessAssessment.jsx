import React, { useState } from 'react'
import AssessmentForm from './AssessmentForm'
import AssessmentResult from './AssessmentResult'
import './WellnessAssessment.css'

const WellnessAssessment = () => {
  const [currentStep, setCurrentStep] = useState('form') // 'form' or 'result'
  const [assessmentData, setAssessmentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (formData) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:3001/api/wellness/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Assessment failed')
      }

      const result = await response.json()
      setAssessmentData(result.data)
      setCurrentStep('result')
    } catch (error) {
      console.error('Assessment error:', error)
      alert('Assessment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
    setAssessmentData(null)
  }

  const handleNewAssessment = () => {
    setCurrentStep('form')
    setAssessmentData(null)
  }

  return (
    <div className="wellness-assessment">
      <div className="assessment-container">
        <div className="assessment-header">
          <h1>Wellness Risk Assessment</h1>
          <p>Get personalized health risk insights based on your lifestyle and demographics</p>
        </div>

        {currentStep === 'form' && (
          <AssessmentForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading}
          />
        )}

        {currentStep === 'result' && assessmentData && (
          <AssessmentResult 
            data={assessmentData}
            onBackToForm={handleBackToForm}
            onNewAssessment={handleNewAssessment}
          />
        )}
      </div>
    </div>
  )
}

export default WellnessAssessment
