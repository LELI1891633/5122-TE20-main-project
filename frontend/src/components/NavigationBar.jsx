import React from 'react'
import './NavigationBar.css'

const NavigationBar = ({ onPageChange, currentPage }) => {
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'healthy', label: 'Health' },
    { id: 'assessment', label: 'Assessment' }
  ]

  return (
    <nav className="navigation-bar">
      <div className="nav-progress-bar">
        {navItems.map((item, index) => (
          <div
            key={item.id}
            className={`nav-indicator ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
            title={item.label}
          />
        ))}
      </div>
    </nav>
  )
}

export default NavigationBar

