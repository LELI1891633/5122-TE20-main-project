import React from 'react'
import './HealthyPage.css'

const HealthyPage = () => {
  return (
    <div className="healthy-container">
      <div className="background-image"></div>
      <div className="content-wrapper">
        <div className="cards-container">
          {/* Healthy Space Card */}
          <div className="card healthy-space">
            <div className="card-background desk-bg"></div>
            <div className="card-overlay">
              <h2>Healthy Space</h2>
            </div>
          </div>

          {/* Healthy You Card */}
          <div className="card healthy-you">
            <div className="card-background meditation-bg"></div>
            <div className="card-overlay">
              <h2>Healthy You</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthyPage
