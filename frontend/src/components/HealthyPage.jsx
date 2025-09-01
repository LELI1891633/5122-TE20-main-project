import React, { useState } from 'react';
import HealthyDesk from './HealthyDesk';
import './HealthyPage.css';

const HealthyPage = () => {
  const [screen, setScreen] = useState('home'); // <-- fixed

  if (screen === 'desk') {
    return <HealthyDesk onBack={() => setScreen('home')} />;
  }

  return (
    <div className="healthy-container">
      <div className="background-image"></div>
      <div className="content-wrapper">
        <div className="cards-container">
          {/* Healthy Space Card */}
          <div
            className="card healthy-space"
            onClick={() => setScreen('desk')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setScreen('desk')}
          >
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
  );
};

export default HealthyPage;
