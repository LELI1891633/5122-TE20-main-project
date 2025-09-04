import React, { useState, useEffect } from 'react'
import './AssessmentForm.css'

const AssessmentForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    state: '',
    activityLevel: '',
    healthCondition: '',
    guidelines: ''
  })

  const [options, setOptions] = useState({
    age_groups: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
    genders: ['Male', 'Female', 'Persons'],
    states: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    activity_levels: ['Zero activity', 'Low activity', 'Moderate activity', 'High activity'],
    health_conditions: ['Obese', 'Overweight', 'Normal weight', 'Underweight'],
    guidelines: ['Meeting guidelines', 'Not meeting guidelines']
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/wellness/options')
      if (response.ok) {
        const data = await response.json()
        setOptions(data)
      } else {
        console.warn('API not available, using default options')
        // Keep default options that are already set
      }
    } catch (error) {
      console.warn('Failed to fetch options from API, using default options:', error)
      // Keep default options that are already set
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Map form data to API format - send all collected fields
    const apiData = {
      ageGroup: formData.ageGroup,
      gender: formData.gender,
      state: formData.state,
      activityLevel: formData.activityLevel,
      healthCondition: formData.healthCondition,
      guidelines: formData.guidelines
    }
    
    onSubmit(apiData)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.ageGroup && formData.gender
      case 2:
        return formData.state && formData.activityLevel
      case 3:
        return formData.healthCondition && formData.guidelines
      default:
        return false
    }
  }

  const renderStep1 = () => (
    <div className="form-step">
      <h3>Basic Information</h3>
      <div className="form-group">
        <label>Age Group</label>
        <select 
          value={formData.ageGroup} 
          onChange={(e) => handleInputChange('ageGroup', e.target.value)}
          required
        >
          <option value="">Select your age group</option>
          {options.age_groups.map(age => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Gender</label>
        <select 
          value={formData.gender} 
          onChange={(e) => handleInputChange('gender', e.target.value)}
          required
        >
          <option value="">Select your gender</option>
          {options.genders.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="form-step">
      <h3>Location & Activity</h3>
      <div className="form-group">
        <label>State</label>
        <select 
          value={formData.state} 
          onChange={(e) => handleInputChange('state', e.target.value)}
          required
        >
          <option value="">Select your state</option>
          {options.states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Activity Level</label>
        <select 
          value={formData.activityLevel} 
          onChange={(e) => handleInputChange('activityLevel', e.target.value)}
          required
        >
          <option value="">Select your activity level</option>
          {options.activity_levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="form-step">
      <h3>Health Information</h3>
      <div className="form-group">
        <label>Health Condition</label>
        <select 
          value={formData.healthCondition} 
          onChange={(e) => handleInputChange('healthCondition', e.target.value)}
          required
        >
          <option value="">Select your health condition</option>
          {options.health_conditions.map(condition => (
            <option key={condition} value={condition}>{condition}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Health Guidelines</label>
        <select 
          value={formData.guidelines} 
          onChange={(e) => handleInputChange('guidelines', e.target.value)}
          required
        >
          <option value="">Select guideline compliance</option>
          {options.guidelines.map(guideline => (
            <option key={guideline} value={guideline}>{guideline}</option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="assessment-form">
      <div className="progress-bar">
        <div className="progress-steps">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`step ${i + 1 <= currentStep ? 'active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="progress-line">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={handlePrevious}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              type="button" 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={!isStepValid() || isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Assessing...' : 'Get Assessment'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AssessmentForm
