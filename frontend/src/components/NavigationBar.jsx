import React from 'react'
import './NavigationBar.css'

const NavigationBar = ({ onPageChange, currentPage }) => {
  const pages = [
    { id: 'landing', label: 'Landing' },
    { id: 'healthy', label: 'Healthy' }
  ]

  return (
    <nav className="nav-progress-bar">
      <div className="nav-indicators">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`nav-indicator ${currentPage === page.id ? 'active' : ''}`}
            onClick={() => onPageChange(page.id)}
          />
        ))}
      </div>
    </nav>
  )
}

export default NavigationBar
