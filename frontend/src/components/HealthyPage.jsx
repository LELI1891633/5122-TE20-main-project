import React from 'react'
import './HealthyPage.css'

const HealthyPage = () => {
  return (
    <div className="healthy-page">
      <div className="cards-container">
        <div className="health-card desk-bg">
          <div className="card-overlay">
            <h3>Healthy Space</h3>
            <p>Optimize your workspace for better health and productivity</p>
          </div>
        </div>
        
        <div className="health-card meditation-bg">
          <div className="card-overlay">
            <h3>Healthy You</h3>
            <p>Take our wellness assessment to understand your health risks</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthyPage

