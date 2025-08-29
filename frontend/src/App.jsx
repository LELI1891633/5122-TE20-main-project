import React, { useState } from 'react'
import NavigationBar from './components/NavigationBar'
import LandingPage from './components/LandingPage'
import HealthyPage from './components/HealthyPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />
      case 'healthy':
        return <HealthyPage />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="App">
      <NavigationBar onPageChange={setCurrentPage} currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
