import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HealthyYou.css";

const HealthyYou = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Healthy You</h1>
        <button className="info-btn" onClick={() => navigate("/health-info")}>ℹ️</button>
      </header>
      <p>Learn about eye health, breaks, and Vitamin D for office workers.</p>
    </div>
  );
};

export default HealthyYou;
